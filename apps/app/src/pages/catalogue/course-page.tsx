import { Alert, Badge, Group, Paper, Text } from '@mantine/core'
import { IconBook2, IconClock, IconNotes, IconUser } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import { getCourse, listCourseNotes } from '@/shared/api/endpoints'
import {
  BackLink,
  BREADCRUMB_HOME,
  CataloguePage,
  DocumentGrid,
  EmptyState,
  GridSkeleton,
  SectionHeading,
} from './components'
import type { Course, CourseNote } from './types'
import styles from './catalogue.module.scss'

export function CoursePage() {
  const { courseId } = useParams({ from: '/courses/$courseId' })

  const courseQuery = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId),
  })

  const notesQuery = useQuery({
    queryKey: ['course-notes', courseId],
    queryFn: () =>
      listCourseNotes(courseId, { limit: 100 }).then((payload) =>
        normalizeCollectionResponse<CourseNote>(payload)
      ),
  })

  const course = courseQuery.data as Course | undefined
  const notes = notesQuery.data?.data ?? []
  const totalPages = notes.reduce((sum, note) => sum + note.pageCount, 0)

  if (courseQuery.isError) {
    return (
      <CataloguePage breadcrumbs={[BREADCRUMB_HOME]} title="Course not found">
        <Alert color="red">This course could not be loaded.</Alert>
        <BackLink to="/" label="Back to catalogue" />
      </CataloguePage>
    )
  }

  const breadcrumbs = [
    BREADCRUMB_HOME,
    ...(course?.departmentId
      ? [
          {
            label: course.departmentName ?? 'Department',
            to: '/departments/$departmentId',
            params: { departmentId: course.departmentId },
          },
        ]
      : []),
    { label: course?.code ?? 'Course' },
  ]

  return (
    <CataloguePage
      eyebrow="Course"
      breadcrumbs={breadcrumbs}
      title={course?.name ?? 'Course'}
      description={course?.description ?? 'Reviewed documents for this course.'}
      actions={
        course?.departmentId ? (
          <BackLink
            to="/departments/$departmentId"
            params={{ departmentId: course.departmentId }}
            label={course.departmentName ?? 'Department'}
          />
        ) : undefined
      }
    >
      {course && (
        <Paper className={styles.courseHero} withBorder radius="lg" mb="xl">
          <div className={styles.courseHeroMain}>
            <Group gap="xs" mb="md">
              <Badge color="brand" variant="light" className={styles.codeBadge}>
                {course.code}
              </Badge>
              {course.levelName && (
                <Badge color="gray" variant="outline">
                  {course.levelName}
                </Badge>
              )}
              {course.semesterName && (
                <Badge color="gray" variant="outline">
                  {course.semesterName}
                </Badge>
              )}
            </Group>
            <Group gap="lg" wrap="wrap">
              {course.lecturerName && (
                <Group gap={6}>
                  <IconUser size={15} />
                  <Text size="sm" c="dimmed">
                    {course.lecturerName}
                  </Text>
                </Group>
              )}
              <Group gap={6}>
                <IconNotes size={15} />
                <Text size="sm" c="dimmed">
                  {notes.length} reviewed document{notes.length === 1 ? '' : 's'}
                </Text>
              </Group>
              <Group gap={6}>
                <IconClock size={15} />
                <Text size="sm" c="dimmed">
                  {totalPages} pages to study
                </Text>
              </Group>
            </Group>
          </div>
          <div className={styles.courseHeroStats}>
            <div>
              <IconNotes size={18} />
              <Text fw={700} size="xl">
                {notes.length}
              </Text>
              <Text size="xs" c="dimmed">
                documents
              </Text>
            </div>
            <div>
              <IconClock size={18} />
              <Text fw={700} size="xl">
                {totalPages}
              </Text>
              <Text size="xs" c="dimmed">
                pages to study
              </Text>
            </div>
            <div>
              <IconBook2 size={18} />
              <Text fw={700} size="xl">
                {course.levelName ?? '—'}
              </Text>
              <Text size="xs" c="dimmed">
                level
              </Text>
            </div>
          </div>
        </Paper>
      )}

      <SectionHeading
        eyebrow="Course library"
        title="Documents for this course"
        description="Lecture notes, revision sheets and practice material, all reviewed before publication."
      />

      {notesQuery.isPending ? (
        <GridSkeleton count={4} />
      ) : notes.length > 0 ? (
        <DocumentGrid
          notes={notes.map((note) => ({
            ...note,
            courseCode: course?.code,
            courseName: course?.name,
          }))}
        />
      ) : (
        <EmptyState
          icon={<IconBook2 size={26} />}
          title="No documents published yet"
          description="This course is open, but its material is still being prepared. Check back soon."
        />
      )}

      {notesQuery.isError && (
        <Alert color="red" mt="lg">
          Could not load the notes for this course.
        </Alert>
      )}
    </CataloguePage>
  )
}

export default CoursePage
