import { Alert, Button, Group, Modal, Select } from "@mantine/core";
import { IconBook } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { unwrapCollection } from "@digitalnotes/core";
import { archiveCourse, listCourses } from "@/shared/api/endpoints/courses";
import {
  listDepartments,
  listLevels,
  listSemesters,
} from "@/shared/api/endpoints/organisation";
import { CourseForm } from "@/features/manage-course";

import {
  CollectionTable,
  PageContainer,
  type TableColumn,
} from "@digitalnotes/core";
import { login } from "@/shared/api/endpoints";

const breadcrumbs = [{ label: "Home", to: "/" as const }, { label: "Courses" }];

export function CoursesView() {
  const queryClient = useQueryClient();
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  useQuery({
    queryKey: ["login"],
    queryFn: () => login({ phoneNumber: "5555", password: "jnskkf" }),
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveCourse(id, {}),
    onSuccess: () => {
      setFeedback("Course archived.");
      void queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    },
    onError: (error) =>
      setFeedback(
        error instanceof Error ? error.message : "Could not archive course.",
      ),
  });

  const columns: TableColumn[] = [
    { accessor: "code", title: "Code", render: (row: any) => row.code },
    { accessor: "name", title: "Name", render: (row: any) => row.name },
    {
      accessor: "departmentId",
      title: "Department",
    },
    {
      accessor: "actions",
      title: "Actions",
      textAlign: "right",
      render: (row: any) => (
        <Button
          type="button"
          variant="subtle"
          color="red"
          size="xs"
          loading={archiveMutation.isPending}
          onClick={() => archiveMutation.mutate(row.id)}
        >
          Archive
        </Button>
      ),
    },
  ];

  const coursesQuery = useQuery({
    queryKey: ["ok"],
    queryFn: () => listCourses({ departmentId }),
  });

  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      title="Courses"
      description="Manage the course catalog"
      icon={<IconBook size={20} />}
      actions={<Button onClick={() => setCreateOpen(true)}>New course</Button>}
    >
      {feedback && <Alert color="blue">{feedback}</Alert>}
      <CollectionTable
        columns={columns}
        fetchApi={listCourses}
        cacheKey="admin-courses"
        customQuery={departmentId ? { departmentId } : undefined}
        limit={20}
      >
        <Group justify="end">
          {/*<Select
            aria-label="Filter department"
            placeholder="All departments"
            clearable
            data={departments.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={departmentId}
            onChange={setDepartmentId}
            w={200}
          />*/}
        </Group>
      </CollectionTable>
      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create course"
        centered
        size="lg"
      >
        <CourseForm
          onSuccess={() => {
            setCreateOpen(false);
            setFeedback("Course created.");
            void queryClient.invalidateQueries({
              queryKey: ["admin", "courses"],
            });
          }}
        />
      </Modal>
    </PageContainer>
  );
}
