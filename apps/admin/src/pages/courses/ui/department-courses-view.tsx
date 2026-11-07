import { Alert, Button, Modal } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  CollectionTable,
  PageContainer,
  type TableColumn,
} from "@digitalnotes/core";
import type { CourseListItem } from "@/entities/course";
import { actionKeys } from "@/shared/api/action-keys";
import { archiveCourse, listCourses } from "@/shared/api/endpoints/courses";
import { revalidateQuery } from "@/shared/api/revalidate-query";
import { useDepartmentLookup } from "../model/use-department-lookup";
import { CourseForm } from "./forms/course-form";
import { FetchableDevEnvironment } from "vite";
import { getDepartment } from "@/shared/api/endpoints";

const departmentCoursesRoute = getRouteApi("/_app/courses/$departmentId/");

export function DepartmentCoursesView() {
  const { departmentId } = departmentCoursesRoute.useParams();
  const navigate = departmentCoursesRoute.useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const { data: department } = useQuery({
    queryKey: [departmentId],
    queryFn: () => getDepartment(departmentId),
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveCourse(id, {}),
    onSuccess: () => {
      setFeedback("Course archived.");
      void revalidateQuery(actionKeys.listCourses);
    },
    onError: (error) =>
      setFeedback(
        error instanceof Error ? error.message : "Could not archive course.",
      ),
  });

  const columns: TableColumn[] = [
    { accessor: "code", title: "Code" },
    { accessor: "name", title: "Name" },
    { accessor: "levelName", title: "Level" },
    { accessor: "semesterName", title: "Semester" },
    { accessor: "lecturerName", title: "Lecturer" },
    {
      accessor: "actions",
      title: "Actions",
      textAlign: "right",
      render: (row: CourseListItem) => (
        <Button
          type="button"
          variant="subtle"
          color="red"
          size="xs"
          loading={archiveMutation.isPending}
          onClick={(event) => {
            event.stopPropagation();
            archiveMutation.mutate(row.id);
          }}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Courses", to: "/courses" },
        { label: department?.name ?? "Department" },
      ]}
      title={department?.name ?? "Courses"}
      description="Courses offered by this department."
      actions={[
        {
          key: "new-course",
          label: "New course",
          icon: <IconPlus size={20} />,
          onClick: () => setCreateOpen(true),
        },
      ]}
    >
      <CollectionTable
        columns={columns}
        fetchApi={listCourses}
        cacheKey={actionKeys.listCourses}
        customQuery={{ departmentId }}
        onRowClick={(row: CourseListItem) =>
          void navigate({
            to: "/courses/$departmentId/$courseId",
            params: { departmentId, courseId: row.id },
          })
        }
      />
      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create course"
        centered
        size="lg"
      >
        <CourseForm
          departmentId={departmentId}
          onSuccess={() => {
            setCreateOpen(false);
            void revalidateQuery(actionKeys.listCourses);
          }}
        />
      </Modal>
    </PageContainer>
  );
}
