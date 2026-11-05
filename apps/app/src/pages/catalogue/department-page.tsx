import { Alert, Group, Select, Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import {
  getDepartment,
  getFaculty,
  getUniversity,
  listCourses,
  listLevels,
  listSemesters,
} from '@/shared/api/endpoints'
import {
  BackLink,
  BREADCRUMB_HOME,
  CataloguePage,
  CourseGrid,
  GridSkeleton,
} from './components'
import type { Course, Department, Faculty, Level, Semester, University } from './types'
import styles from './catalogue.module.scss'

export function DepartmentPage() {
  const { departmentId } = useParams({ from: '/departments/$departmentId' })
  const [level, setLevel] = useState('ALL')
  const [semester, setSemester] = useState('ALL')

  const departmentQuery = useQuery({
    queryKey: ['department', departmentId],
    queryFn: () => getDepartment(departmentId),
  })
  const department = departmentQuery.data as Department | undefined

  const facultyQuery = useQuery({
    queryKey: ['faculty', department?.facultyId],
    queryFn: () => getFaculty(department?.facultyId as string),
    enabled: Boolean(department?.facultyId),
  })
  const faculty = facultyQuery.data as Faculty | undefined

  const universityQuery = useQuery({
    queryKey: ['university', faculty?.universityId],
    queryFn: () => getUniversity(faculty?.universityId as string),
    enabled: Boolean(faculty?.universityId),
  })
  const university = universityQuery.data as University | undefined

  const levelsQuery = useQuery({
    queryKey: ['levels', departmentId],
    queryFn: () =>
      listLevels({ departmentId, limit: 100 }).then((payload) =>
        normalizeCollectionResponse<Level>(payload).data
      ),
  })

  const semestersQuery = useQuery({
    queryKey: ['semesters', departmentId],
    queryFn: () =>
      listSemesters({ departmentId, limit: 100 }).then((payload) =>
        normalizeCollectionResponse<Semester>(payload).data
      ),
  })

  const coursesQuery = useQuery({
    queryKey: ['courses', departmentId, level, semester],
    queryFn: () =>
      listCourses({
        departmentId,
        ...(level === 'ALL' ? {} : { levelId: level }),
        ...(semester === 'ALL' ? {} : { semesterId: semester }),
        limit: 100,
      }).then((payload) => normalizeCollectionResponse<Course>(payload).data),
    placeholderData: (previous) => previous,
  })

  const levels = levelsQuery.data ?? []
  const semesters = semestersQuery.data ?? []
  const courses = coursesQuery.data ?? []

  if (departmentQuery.isError) {
    return (
      <CataloguePage breadcrumbs={[BREADCRUMB_HOME]} title="Department not found">
        <Alert color="red">This department could not be loaded.</Alert>
        <BackLink to="/" label="Back to catalogue" />
      </CataloguePage>
    )
  }

  const breadcrumbs = [
    BREADCRUMB_HOME,
    ...(university
      ? [
          {
            label: university.name,
            to: '/universities/$universityId',
            params: { universityId: university.id },
          },
        ]
      : []),
    ...(faculty
      ? [
          {
            label: faculty.name,
            to: '/faculties/$facultyId',
            params: { facultyId: faculty.id },
          },
        ]
      : []),
    { label: department?.name ?? 'Department' },
  ]

  return (
    <CataloguePage
      breadcrumbs={breadcrumbs}
      title={department?.name ?? 'Department'}
      description="Pick your level and semester, then open a course to see its approved notes."
      actions={
        <Group gap="sm" wrap="wrap">
          <Select
            aria-label="Filter by level"
            value={level}
            onChange={(value) => setLevel(value ?? 'ALL')}
            data={[
              { value: 'ALL', label: 'All levels' },
              ...levels.map((item) => ({ value: item.id, label: item.name })),
            ]}
            w={160}
            allowDeselect={false}
          />
          <Select
            aria-label="Filter by semester"
            value={semester}
            onChange={(value) => setSemester(value ?? 'ALL')}
            data={[
              { value: 'ALL', label: 'All semesters' },
              ...semesters.map((item) => ({ value: item.id, label: item.name })),
            ]}
            w={170}
            allowDeselect={false}
          />
        </Group>
      }
    >
      <Group justify="space-between" mb="md">
        <Text size="sm" c="dimmed">
          {courses.length} course{courses.length === 1 ? '' : 's'}
        </Text>
      </Group>

      {coursesQuery.isLoading ? <GridSkeleton /> : <CourseGrid courses={courses} />}

      {coursesQuery.isError && (
        <Alert color="red" mt="lg">
          Could not load the courses for this department.
        </Alert>
      )}

      {courses.length > 0 && (
        <Text size="xs" c="dimmed" mt="md" className={styles.hint}>
          Notes shown inside a course have already been reviewed and published.
        </Text>
      )}
    </CataloguePage>
  )
}

export default DepartmentPage
