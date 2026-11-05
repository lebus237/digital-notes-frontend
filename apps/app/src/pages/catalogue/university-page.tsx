import { Alert } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import { getUniversity, listFaculties } from '@/shared/api/endpoints'
import {
  BackLink,
  BREADCRUMB_HOME,
  CataloguePage,
  EntityGrid,
  GridSkeleton,
} from './components'
import type { Faculty, University } from './types'

export function UniversityPage() {
  const { universityId } = useParams({ from: '/universities/$universityId' })

  const universityQuery = useQuery({
    queryKey: ['university', universityId],
    queryFn: () => getUniversity(universityId),
  })

  const facultiesQuery = useQuery({
    queryKey: ['faculties', universityId],
    queryFn: () =>
      listFaculties({ universityId, limit: 100 }).then((payload) =>
        normalizeCollectionResponse<Faculty>(payload).data
      ),
  })

  const university = universityQuery.data as University | undefined
  const faculties = facultiesQuery.data ?? []

  if (universityQuery.isError) {
    return (
      <CataloguePage breadcrumbs={[BREADCRUMB_HOME]} title="University not found">
        <Alert color="red">This university could not be loaded.</Alert>
        <BackLink to="/" label="Back to catalogue" />
      </CataloguePage>
    )
  }

  return (
    <CataloguePage
      breadcrumbs={[BREADCRUMB_HOME, { label: university?.name ?? 'University' }]}
      title={university?.name ?? 'University'}
      description="Choose the faculty or school that hosts your programme."
      actions={<BackLink to="/" label="All universities" />}
    >
      {facultiesQuery.isLoading ? (
        <GridSkeleton />
      ) : (
        <EntityGrid
          kind="faculty"
          items={faculties.map((faculty) => ({ id: faculty.id, name: faculty.name }))}
          getLink={(item) => ({
            to: '/faculties/$facultyId',
            params: { facultyId: item.id },
          })}
        />
      )}

      {facultiesQuery.isError && (
        <Alert color="red" mt="lg">
          Could not load the faculties for this university.
        </Alert>
      )}
    </CataloguePage>
  )
}

export default UniversityPage
