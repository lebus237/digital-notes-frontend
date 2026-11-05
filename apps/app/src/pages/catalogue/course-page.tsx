import { Alert, Badge, Box, Group, Paper, Text, Title } from '@mantine/core'
import { IconClock, IconNotes, IconUser } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import { getCourse, listCourseNotes } from '@/shared/api/endpoints'
import {
  BackLink,
  BREADCRUMB_HOME,
  CataloguePage,
  GridSkeleton,
  NoteGrid,
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
        normalizeCollectionResponse<CourseNote>(payload).data
      ),
  })

  const course = courseQuery.data as Course | undefined
  const notes = notesQuery.data ?? []

  if (courseQuery.isError) {
    return (
      <CataloguePage breadcrumbs={[BREADCRUMB_HOME]} title="Course not found">
        <Alert color="red">This course could not be loaded.</Alert>
        <BackLink to="/" label="Back to catalogue" />
      </CataloguePage>
    )
  }

  return (
    <CataloguePage
      breadcrumbs={[BREADCRUMB_HOME, { label: course?.code ?? 'Course' }]}
      title={course?.name ?? 'Course'}
      description={course?.description ?? 'Approved course material for this course.'}
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
        <Paper className={styles.courseHero} withBorder radius="lg" p="lg" mb="xl">
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="lg">
            <Box>
              <Group gap="xs" mb={10}>
                <Badge color="brand" variant="light">
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
              <Title order={2} className={styles.courseHeroTitle}>
                {course.name}
              </Title>
              {course.lecturerName && (
                <Group gap={6} mt="sm">
                  <IconUser size={15} />
                  <Text size="sm" c="dimmed">
                    {course.lecturerName}
                  </Text>
                </Group>
              )}
            </Box>
            <Group gap="lg">
              <Box className={styles.courseStat}>
                <IconNotes size={18} />
                <Text fw={700}>{notes.length}</Text>
                <Text size="xs" c="dimmed">
                  notes
                </Text>
              </Box>
              <Box className={styles.courseStat}>
                <IconClock size={18} />
                <Text fw={700}>{notes.reduce((total, note) => total + note.pageCount, 0)}</Text>
                <Text size="xs" c="dimmed">
                  pages
                </Text>
              </Box>
            </Group>
          </Group>
        </Paper>
      )}

      <Group justify="space-between" mb="md">
        <Title order={3} className={styles.sectionTitle}>
          Available notes
        </Title>
        <Text size="sm" c="dimmed">
          {notes.length} resource{notes.length === 1 ? '' : 's'}
        </Text>
      </Group>

      {notesQuery.isPending ? <GridSkeleton /> : <NoteGrid notes={notes} />}

      {notesQuery.isError && (
        <Alert color="red" mt="lg">
          Could not load the notes for this course.
        </Alert>
      )}
    </CataloguePage>
  )
}

export default CoursePage
