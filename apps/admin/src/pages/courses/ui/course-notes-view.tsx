import { Alert, Badge, Button, Group, Select } from "@mantine/core";
import { getRouteApi } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
  CollectionTable,
  PageContainer,
  formatPrice,
  type TableColumn,
} from "@digitalnotes/core";
import {
  noteStatuses,
  type NoteListItem,
  type NoteStatus,
  type NoteType,
} from "@/entities/note";
import { actionKeys } from "@/shared/api/action-keys";
import { getCourse } from "@/shared/api/endpoints/courses";
import {
  archiveNote,
  listCourseNotes,
  publishNote,
  rejectNote,
} from "@/shared/api/endpoints/notes";
import { revalidateQuery } from "@/shared/api/revalidate-query";

const courseNotesRoute = getRouteApi("/_app/courses/$departmentId/$courseId/");

const statusLabels: Record<NoteStatus, string> = {
  DRAFT: "Draft",
  CONVERTED: "Converted",
  PENDING_REVIEW: "Pending review",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
};

const statusColors: Record<NoteStatus, string> = {
  DRAFT: "gray",
  CONVERTED: "blue",
  PENDING_REVIEW: "yellow",
  PUBLISHED: "green",
  REJECTED: "red",
  ARCHIVED: "dark",
};

const noteTypeLabels: Record<NoteType, string> = {
  LECTURE_NOTES: "Lecture notes",
  SUMMARY: "Summary",
  REVISION: "Revision",
  PAST_EXAM: "Past exam",
  EXERCISES: "Exercises",
};

type NoteAction = "publish" | "reject" | "archive";

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

export function CourseNotesView() {
  const { departmentId, courseId } = courseNotesRoute.useParams();
  const [status, setStatus] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const { data: course } = useQuery({
    queryKey: [actionKeys.getCourse, courseId],
    queryFn: () => getCourse(courseId),
    staleTime: 60_000,
  });

  const notesCacheKey = `${actionKeys.listCourseNotes}:${courseId}`;

  const fetchNotes = useCallback(
    (query: any) => listCourseNotes(courseId, query),
    [courseId],
  );

  const statusMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: NoteAction }) => {
      if (action === "publish") return publishNote(id, {});
      if (action === "reject") return rejectNote(id, {});
      return archiveNote(id, {});
    },
    onSuccess: () => {
      setFeedback("Note updated.");
      void revalidateQuery(notesCacheKey);
    },
    onError: (error) =>
      setFeedback(
        error instanceof Error ? error.message : "Could not update the note.",
      ),
  });

  const columns: TableColumn[] = [
    { accessor: "title", title: "Title" },
    {
      accessor: "noteType",
      title: "Type",
      render: (row: NoteListItem) => noteTypeLabels[row.noteType] ?? row.noteType,
    },
    {
      accessor: "price",
      title: "Price",
      render: (row: NoteListItem) => formatPrice(row.price),
    },
    {
      accessor: "status",
      title: "Status",
      render: (row: NoteListItem) => (
        <Badge color={statusColors[row.status]} variant="light">
          {statusLabels[row.status] ?? row.status}
        </Badge>
      ),
    },
    { accessor: "pageCount", title: "Pages" },
    {
      accessor: "updatedAt",
      title: "Updated",
      render: (row: NoteListItem) => formatDate(row.updatedAt),
    },
    {
      accessor: "actions",
      title: "Actions",
      textAlign: "right",
      render: (row: NoteListItem) => (
        <Group gap="xs" justify="end" wrap="nowrap">
          {row.status === "PENDING_REVIEW" && (
            <>
              <Button
                type="button"
                variant="subtle"
                color="green"
                size="xs"
                loading={statusMutation.isPending}
                onClick={(event) => {
                  event.stopPropagation();
                  statusMutation.mutate({ id: row.id, action: "publish" });
                }}
              >
                Publish
              </Button>
              <Button
                type="button"
                variant="subtle"
                color="orange"
                size="xs"
                loading={statusMutation.isPending}
                onClick={(event) => {
                  event.stopPropagation();
                  statusMutation.mutate({ id: row.id, action: "reject" });
                }}
              >
                Reject
              </Button>
            </>
          )}
          {row.status !== "ARCHIVED" && (
            <Button
              type="button"
              variant="subtle"
              color="red"
              size="xs"
              loading={statusMutation.isPending}
              onClick={(event) => {
                event.stopPropagation();
                statusMutation.mutate({ id: row.id, action: "archive" });
              }}
            >
              Archive
            </Button>
          )}
        </Group>
      ),
    },
  ];

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Courses", to: "/courses" },
        { label: course?.departmentName ?? "Department", to: `/courses/${departmentId}` },
        { label: course?.name ?? "Course" },
      ]}
      title={course?.name ?? "Notes"}
      description={
        course
          ? `${course.code} · ${course.levelName} · ${course.semesterName}`
          : "Notes published for this course."
      }
    >
      {feedback && <Alert color="blue">{feedback}</Alert>}
      <CollectionTable
        columns={columns}
        fetchApi={fetchNotes}
        cacheKey={notesCacheKey}
        customQuery={{ status: status ?? undefined }}
        limit={20}
      >
        <Select
          aria-label="Filter by status"
          placeholder="All statuses"
          clearable
          data={noteStatuses.map((item) => ({
            value: item,
            label: statusLabels[item],
          }))}
          value={status}
          onChange={setStatus}
          w={200}
        />
      </CollectionTable>
    </PageContainer>
  );
}
