import { Alert, Button, Modal, Select } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { unwrapCollection } from '@digitalnotes/core'
import { archiveCourse, listCourses } from '@/shared/api/endpoints/courses'
import { listDepartments, listLevels, listSemesters } from '@/shared/api/endpoints/organisation'
import { CourseForm } from '@/features/manage-course'
import { CollectionTable, PageContainer, type TableColumn } from '@digitalnotes/core'
import { queryKeys } from '@/shared/api/query-client'

const breadcrumbs = [{ label: 'Home', to: '/' as const }, { label: 'Courses' }]

export function CoursesView() {
  const queryClient = useQueryClient()
  const [departmentId, setDepartmentId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [feedback, setFeedback] = useState('')

  const departmentsQuery = useQuery({
    queryKey: queryKeys.departments(undefined, ''),
    queryFn: async () => unwrapCollection<{ id: string; name: string }>(await listDepartments({})),
  })
  const levelsQuery = useQuery({
    queryKey: queryKeys.levels(undefined, ''),
    queryFn: async () => unwrapCollection<{ id: string; name: string }>(await listLevels({})),
  })
  const semestersQuery = useQuery({
    queryKey: queryKeys.semesters(''),
    queryFn: async () => unwrapCollection<{ id: string; name: string }>(await listSemesters({})),
  })

  const departments = departmentsQuery.data ?? []

  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveCourse(id, {}),
    onSuccess: () => {
      setFeedback('Course archived.')
      void queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] })
    },
    onError: (error) => setFeedback(error instanceof Error ? error.message : 'Could not archive course.'),
  })

  const columns: TableColumn[] = [
    { accessor: 'code', title: 'Code', render: (row: any) => row.code },
    { accessor: 'name', title: 'Name', render: (row: any) => row.name },
    {
      accessor: 'departmentId',
      title: 'Department',
      render: (row: any) => departments.find((item) => item.id === row.departmentId)?.name ?? row.departmentName ?? row.departmentId,
    },
    {
      accessor: 'actions',
      title: 'Actions',
      textAlign: 'right',
      render: (row: any) => (
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
      {feedback && <Alert color="blue">{feedback}</Alert>}
      <CollectionTable
        columns={columns}
        fetchApi={listCourses}
        cacheKey="admin-courses"
        customQuery={departmentId ? { departmentId } : undefined}
        limit={20}
      >
        <Select
          aria-label="Filter department"
          placeholder="All departments"
          clearable
          data={departments.map((item) => ({ value: item.id, label: item.name }))}
          value={departmentId}
          onChange={setDepartmentId}
          w={200}
        />
      </CollectionTable>
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
