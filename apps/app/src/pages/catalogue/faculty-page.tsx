import { Alert } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import { getFaculty, getUniversity, listDepartments } from '@/shared/api/endpoints'
import {
  BackLink,
  BREADCRUMB_HOME,
  CataloguePage,
  EntityGrid,
  GridSkeleton,
} from './components'
import type { Department, Faculty, University } from './types'

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
        normalizeCollectionResponse<Department>(payload).data
      ),
  })

  const departments = departmentsQuery.data ?? []

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
      breadcrumbs={breadcrumbs}
      title={faculty?.name ?? 'Faculty'}
      description="Choose your department to see the courses available for your programme."
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
      {departmentsQuery.isPending ? (
        <GridSkeleton />
      ) : (
        <EntityGrid
          kind="department"
          items={departments.map((department) => ({ id: department.id, name: department.name }))}
          getLink={(item) => ({
            to: '/departments/$departmentId',
            params: { departmentId: item.id },
          })}
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
