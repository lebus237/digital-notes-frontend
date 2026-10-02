import { Alert, Button, Modal, Select } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { unwrapCollection } from '@digitalnotes/core'
import { listEmployees } from '@/shared/api/endpoints/employees'
import { listUniversities } from '@/shared/api/endpoints/organisation'
import { EmployeeForm } from '@/features/manage-employee'
import { CollectionTable, PageContainer, type TableColumn } from '@digitalnotes/core'
import { queryKeys } from '@/shared/api/query-client'
import { adminResetPassword } from '@/shared/api/endpoints'

const breadcrumbs = [{ label: 'Home', to: '/' as const }, { label: 'Employees' }]

const ROLE_OPTIONS = [
  { value: 'administrator', label: 'Administrator' },
  { value: 'staff', label: 'Staff' },
  { value: 'reviewer', label: 'Reviewer' },
]

export function EmployeesView() {
  const queryClient = useQueryClient()
  const [universityId, setUniversityId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [feedback, setFeedback] = useState('')

  const universitiesQuery = useQuery({
    queryKey: queryKeys.universities(''),
    queryFn: async () => unwrapCollection<{ id: string; name: string }>(await listUniversities({})),
  })
  const universities = universitiesQuery.data ?? []

  const resetMutation = useMutation({
    mutationFn: (id: string) => adminResetPassword(id, { newPassword: `Reset-${Date.now().toString(36)}-Aa1` }),
    onSuccess: () => setFeedback('Password reset link sent.'),
    onError: (error) => setFeedback(error instanceof Error ? error.message : 'Could not reset password.'),
  })

  const columns: TableColumn[] = [
    { accessor: 'fullName', title: 'Name', render: (row: any) => row.fullName },
    { accessor: 'email', title: 'Email', render: (row: any) => row.email },
    { accessor: 'role', title: 'Role', render: (row: any) => row.role },
    {
      accessor: 'universityId',
      title: 'University',
      render: (row: any) => universities.find((item) => item.id === row.universityId)?.name ?? row.universityName ?? row.universityId,
    },
    {
      accessor: 'actions',
      title: 'Actions',
      textAlign: 'right',
      render: (row: any) => (
        <Button type="button" variant="subtle" size="xs" loading={resetMutation.isPending} onClick={() => resetMutation.mutate(row.id)}>
          Reset password
        </Button>
      ),
    },
  ]

  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      actions={<Button size="xs" onClick={() => setCreateOpen(true)}>New employee</Button>}
    >
      {feedback && <Alert color="blue">{feedback}</Alert>}
      <CollectionTable
        columns={columns}
        fetchApi={listEmployees}
        cacheKey="admin-employees"
        customQuery={universityId ? { universityId } : undefined}
        limit={20}
      >
        <Select
          aria-label="Filter university"
          placeholder="All universities"
          clearable
          data={universities.map((item) => ({ value: item.id, label: item.name }))}
          value={universityId}
          onChange={setUniversityId}
          w={200}
        />
      </CollectionTable>
      <Modal opened={createOpen} onClose={() => setCreateOpen(false)} title="Create employee" centered>
        <EmployeeForm
          universities={universities.map((item) => ({ value: item.id, label: item.name }))}
          roles={ROLE_OPTIONS}
          onSuccess={() => {
            setCreateOpen(false)
            setFeedback('Employee created.')
            void queryClient.invalidateQueries({ queryKey: ['admin', 'employees'] })
          }}
        />
      </Modal>
    </PageContainer>
  )
}
