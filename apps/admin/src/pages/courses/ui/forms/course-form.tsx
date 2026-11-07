import { Alert, Button, Stack } from "@mantine/core";
import { formOptions } from "@tanstack/react-form";
import { useMemo, useState } from "react";
import {
  FormField,
  FormWrapper,
  getServerMessage,
} from "@digitalnotes/core";
import { courseSchema, type CourseValues } from "@/entities/course";
import { actionKeys } from "@/shared/api/action-keys";
import { createCourse } from "@/shared/api/endpoints/courses";
import { listLevels, listSemesters } from "@/shared/api/endpoints/organisation";

export function CourseForm({
  departmentId,
  onSuccess,
}: Readonly<{
  departmentId: string;
  onSuccess?: () => void;
}>) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

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
        <FormField.AsyncAutocomplete
          name="levelId"
          label="Level"
          placeholder="Select level"
          fetchApi={listLevels}
          cacheKey={`${actionKeys.listLevels}-course-options`}
          customQuery={{ departmentId }}
          withAsterisk
        />
        <FormField.AsyncAutocomplete
          name="semesterId"
          label="Semester"
          placeholder="Select semester"
          fetchApi={listSemesters}
          cacheKey={`${actionKeys.listSemesters}-course-options`}
          customQuery={{ departmentId }}
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
