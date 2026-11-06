import { Alert, Group, Text } from '@mantine/core'
import { IconSchool } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { normalizeCollectionResponse } from '@digitalnotes/core'
import { getUniversity, listFaculties } from '@/shared/api/endpoints'
import {
  BackLink,
  BREADCRUMB_HOME,
  CataloguePage,
  EmptyState,
  EntityGrid,
  GridSkeleton,
  SectionHeading,
} from './components'
import type { Faculty, University } from './types'
import styles from './catalogue.module.scss'

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
        normalizeCollectionResponse<Faculty>(payload)
      ),
  })

  const university = universityQuery.data as University | undefined
  const faculties = facultiesQuery.data?.data ?? []
  const total = facultiesQuery.data?.meta.pagination.total ?? faculties.length

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
      eyebrow="University"
      breadcrumbs={[BREADCRUMB_HOME, { label: university?.name ?? 'University' }]}
      title={university?.name ?? 'University'}
      description="Choose the faculty or school that hosts your programme, then continue down to your department and courses."
      actions={<BackLink to="/" label="All universities" />}
    >
      <div className={styles.indexSummary}>
        <Group gap="xl">
          <div>
            <Text className={styles.summaryValue}>{total}</Text>
            <Text size="xs" c="dimmed">
              facult{total === 1 ? 'y' : 'ies'}
            </Text>
          </div>
          <div className={styles.summaryDivider} />
          <div>
            <Text className={styles.summaryLabel}>Structure</Text>
            <Text size="sm" c="dimmed">
              Faculty → Department → Course → Notes
            </Text>
          </div>
        </Group>
      </div>

      <SectionHeading
        eyebrow="Faculties"
        title="Where is your programme based?"
        description="Each faculty contains its own departments and course catalogue."
      />

      {facultiesQuery.isPending ? (
        <GridSkeleton count={3} />
      ) : faculties.length > 0 ? (
        <EntityGrid
          kind="faculty"
          items={faculties.map((faculty) => ({
            id: faculty.id,
            name: faculty.name,
            meta: university?.name,
          }))}
          getLink={(item) => ({
            to: '/faculties/$facultyId',
            params: { facultyId: item.id },
          })}
        />
      ) : (
        <EmptyState
          icon={<IconSchool size={26} />}
          title="No faculties yet"
          description="This university is in the catalogue, but its faculties have not been added yet."
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
