import { Alert, Group, Text } from '@mantine/core'
import { IconFolder } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import { getFaculty, getUniversity, listDepartments } from '@/shared/api/endpoints'
import {
  BackLink,
  BREADCRUMB_HOME,
  CataloguePage,
  EmptyState,
  EntityGrid,
  GridSkeleton,
  SectionHeading,
} from './components'
import type { Department, Faculty, University } from './types'
import styles from './catalogue.module.scss'

export function FacultyPage() {
  const { facultyId } = useParams({ from: '/faculties/$facultyId' })

  const facultyQuery = useQuery({
    queryKey: ['faculty', facultyId],
    queryFn: () => getFaculty(facultyId),
  })

  const faculty = facultyQuery.data as Faculty | undefined

  const universityQuery = useQuery({
    queryKey: ['university', faculty?.universityId],
    queryFn: () => getUniversity(faculty?.universityId as string),
    enabled: Boolean(faculty?.universityId),
  })

  const university = universityQuery.data as University | undefined

  const departmentsQuery = useQuery({
    queryKey: ['departments', facultyId],
    queryFn: () =>
      listDepartments({ facultyId, limit: 100 }).then((payload) =>
        normalizeCollectionResponse<Department>(payload)
      ),
  })

  const departments = departmentsQuery.data?.data ?? []
  const total = departmentsQuery.data?.meta.pagination.total ?? departments.length

  if (facultyQuery.isError) {
    return (
      <CataloguePage breadcrumbs={[BREADCRUMB_HOME]} title="Faculty not found">
        <Alert color="red">This faculty could not be loaded.</Alert>
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
    { label: faculty?.name ?? 'Faculty' },
  ]

  return (
    <CataloguePage
      eyebrow="Faculty"
      breadcrumbs={breadcrumbs}
      title={faculty?.name ?? 'Faculty'}
      description="Your faculty brings together the departments and course programmes in your field."
      actions={
        university ? (
          <BackLink
            to="/universities/$universityId"
            params={{ universityId: university.id }}
            label={university.name}
          />
        ) : undefined
      }
    >
      <div className={styles.indexSummary}>
        <Group gap="xl" wrap="wrap">
          <div>
            <Text className={styles.summaryValue}>{total}</Text>
            <Text size="xs" c="dimmed">
              department{total === 1 ? '' : 's'}
            </Text>
          </div>
          <div className={styles.summaryDivider} />
          <div>
            <Text className={styles.summaryLabel}>Part of</Text>
            <Text size="sm" c="dimmed">
              {university?.name ?? 'University catalogue'}
            </Text>
          </div>
        </Group>
      </div>

      <SectionHeading
        eyebrow="Departments"
        title="Find your department"
        description="Choose a department to see its levels, semesters and courses."
      />

      {departmentsQuery.isPending ? (
        <GridSkeleton count={3} />
      ) : departments.length > 0 ? (
        <EntityGrid
          kind="department"
          items={departments.map((department) => ({
            id: department.id,
            name: department.name,
            meta: faculty?.name,
          }))}
          getLink={(item) => ({
            to: '/departments/$departmentId',
            params: { departmentId: item.id },
          })}
        />
      ) : (
        <EmptyState
          icon={<IconFolder size={26} />}
          title="No departments yet"
          description="The faculty is in the catalogue, but its departments have not been added yet."
        />
      )}

      {departmentsQuery.isError && (
        <Alert color="red" mt="lg">
          Could not load the departments for this faculty.
        </Alert>
      )}
    </CataloguePage>
  )
}

export default FacultyPage
