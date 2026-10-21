import { Alert, Button, Stack } from "@mantine/core";
import { formOptions } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  FormField,
  FormWrapper,
  getServerMessage,
  normalizeCollectionResponse,
} from "@digitalnotes/core";
import { courseSchema, type CourseValues } from "@/entities/course";
import { actionKeys } from "@/shared/api/action-keys";
import { createCourse } from "@/shared/api/endpoints/courses";
import { listLevels, listSemesters } from "@/shared/api/endpoints/organisation";

type NamedOption = { id: string; name: string };

export function CourseForm({
  departmentId,
  onSuccess,
}: Readonly<{
  departmentId: string;
  onSuccess?: () => void;
}>) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const { data: levels = [] } = useQuery({
    queryKey: [actionKeys.listLevels, "options", departmentId],
    queryFn: () => listLevels({ departmentId, page: 1, limit: 100 }),
    staleTime: 60_000,
    select: (payload) => normalizeCollectionResponse<NamedOption>(payload).data,
  });

  const { data: semesters = [] } = useQuery({
    queryKey: [actionKeys.listSemesters, "options"],
    queryFn: () => listSemesters({ page: 1, limit: 100 }),
    staleTime: 60_000,
    select: (payload) => normalizeCollectionResponse<NamedOption>(payload).data,
  });

  const courseOpts = useMemo(
    () =>
      formOptions({
        defaultValues: {
          departmentId: departmentId ?? "",
          levelId: "",
          semesterId: "",
          code: "",
          name: "",
          description: "",
          lecturerName: "",
        } satisfies CourseValues,
        validators: { onSubmit: courseSchema },
      }),
    [departmentId],
  );

  async function handleSubmit(value: CourseValues) {
    setError("");
    setPending(true);
    try {
      const result = (await createCourse(value)) as unknown;
      if (
        result !== null &&
        typeof result === "object" &&
        "status" in result &&
        (result as { status?: string }).status === "error"
      ) {
        throw new Error(
          (result as { error?: { message?: string } }).error?.message ??
            "Could not create course.",
        );
      }
      onSuccess?.();
    } catch (submitError) {
      setError(getServerMessage(submitError, "Could not create course."));
    } finally {
      setPending(false);
    }
  }

  return (
    <FormWrapper
      key={departmentId}
      formOptions={courseOpts}
      onSubmit={handleSubmit}
    >
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        <FormField.Select
          name="levelId"
          label="Level"
          placeholder="Select level"
          data={levels.map((item) => ({ value: item.id, label: item.name }))}
          withAsterisk
        />
        <FormField.Select
          name="semesterId"
          label="Semester"
          placeholder="Select semester"
          data={semesters.map((item) => ({ value: item.id, label: item.name }))}
          withAsterisk
        />
        <FormField.TextInput
          name="code"
          label="Course code"
          placeholder="e.g. CSC 101"
          withAsterisk
        />
        <FormField.TextInput
          name="name"
          label="Course name"
          placeholder="e.g. Introduction to Computing"
          withAsterisk
        />
        <FormField.TextArea
          name="description"
          label="Description"
          placeholder="Optional course description"
          minRows={2}
        />
        <FormField.TextInput
          name="lecturerName"
          label="Lecturer"
          placeholder="Optional lecturer name"
        />
        <Button type="submit" loading={pending}>
          Create course
        </Button>
      </Stack>
    </FormWrapper>
  );
}
