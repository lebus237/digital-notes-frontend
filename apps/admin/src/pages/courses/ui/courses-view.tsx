import { Alert, Button, Modal, Select } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { courseApi, type Course } from '@/entities/course'
import { organisationApi } from '@/entities/organisation'
import { CourseForm } from '@/features/manage-course'
import { CollectionManager, type CollectionColumn } from '@/widgets/collection'
import { PageContainer } from '@/widgets/page-container'
import { queryKeys } from '@/shared/api/query-client'

const breadcrumbs = [{ label: 'Home', to: '/' as const }, { label: 'Courses' }]

export function CoursesView() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [feedback, setFeedback] = useState('')

  const filters = useMemo(
    () => ({ search, departmentId: departmentId ?? undefined }),
    [search, departmentId],
  )
  const coursesQuery = useQuery({ queryKey: queryKeys.courses(filters), queryFn: () => courseApi.list(filters) })
  const departmentsQuery = useQuery({ queryKey: queryKeys.departments(undefined, ''), queryFn: () => organisationApi.departments({}) })
  const levelsQuery = useQuery({ queryKey: queryKeys.levels(undefined, ''), queryFn: () => organisationApi.levels({}) })
  const semestersQuery = useQuery({ queryKey: queryKeys.semesters(''), queryFn: () => organisationApi.semesters({}) })

  const courses = coursesQuery.data ?? []
  const departments = departmentsQuery.data ?? []

  const archiveMutation = useMutation({
    mutationFn: (id: string) => courseApi.archive(id),
    onSuccess: (_data, id) => {
      setFeedback('Course archived.')
      void queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] })
    },
    onError: (error) => setFeedback(error instanceof Error ? error.message : 'Could not archive course.'),
  })

  const columns: Array<CollectionColumn<Course>> = [
    { key: 'code', title: 'Code', render: (row) => row.code },
    { key: 'name', title: 'Name', render: (row) => row.name },
    {
      key: 'departmentId',
      title: 'Department',
      render: (row) => departments.find((item) => item.id === row.departmentId)?.name ?? row.departmentId,
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'right',
      render: (row) => (
        <Button type="button" variant="subtle" color="red" size="xs" loading={archiveMutation.isPending} onClick={() => archiveMutation.mutate(row.id)}>
          Archive
        </Button>
      ),
    },
  ]

  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      actions={(
        <Button size="xs" onClick={() => setCreateOpen(true)}>New course</Button>
      )}
    >
      {coursesQuery.isError && <Alert color="yellow">Could not reach the courses API. Check admin session.</Alert>}
      {feedback && <Alert color="blue">{feedback}</Alert>}
      <CollectionManager
        rows={courses}
        columns={columns}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search courses"
        summary={`${courses.length} courses`}
        emptyLabel="No courses match this view."
        filter={(
          <Select
            aria-label="Filter department"
            placeholder="All departments"
            clearable
            data={departments.map((item) => ({ value: item.id, label: item.name }))}
            value={departmentId}
            onChange={setDepartmentId}
            w={200}
          />
        )}
      />
      <Modal opened={createOpen} onClose={() => setCreateOpen(false)} title="Create course" centered size="lg">
        <CourseForm
          departments={(departmentsQuery.data ?? []).map((item) => ({ value: item.id, label: item.name }))}
          levels={(levelsQuery.data ?? []).map((item) => ({ value: item.id, label: item.name }))}
          semesters={(semestersQuery.data ?? []).map((item) => ({ value: item.id, label: item.name }))}
          onSuccess={() => {
            setCreateOpen(false)
            setFeedback('Course created.')
            void queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] })
          }}
        />
      </Modal>
    </PageContainer>
  )
}
