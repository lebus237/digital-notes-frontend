import { Alert, Button, Modal, Select } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { employeeApi, type Employee } from '@/entities/employee'
import { organisationApi } from '@/entities/organisation'
import { EmployeeForm } from '@/features/manage-employee'
import { CollectionManager, type CollectionColumn } from '@/widgets/collection'
import { PageContainer } from '@/widgets/page-container'
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
  const [search, setSearch] = useState('')
  const [universityId, setUniversityId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [feedback, setFeedback] = useState('')

  const filters = useMemo(() => ({ search, universityId: universityId ?? undefined }), [search, universityId])
  const employeesQuery = useQuery({ queryKey: queryKeys.employees(universityId ?? undefined, search), queryFn: () => employeeApi.list(filters) })
  const universitiesQuery = useQuery({ queryKey: queryKeys.universities(''), queryFn: () => organisationApi.universities({}) })

  const employees = employeesQuery.data ?? []
  const universities = universitiesQuery.data ?? []

  const resetMutation = useMutation({
    mutationFn: (id: string) => adminResetPassword(id, { newPassword: `Reset-${Date.now().toString(36)}-Aa1` }),
    onSuccess: () => setFeedback('Password reset link sent.'),
    onError: (error) => setFeedback(error instanceof Error ? error.message : 'Could not reset password.'),
  })

  const columns: Array<CollectionColumn<Employee>> = [
    { key: 'fullName', title: 'Name', render: (row) => row.fullName },
    { key: 'email', title: 'Email', render: (row) => row.email },
    { key: 'role', title: 'Role', render: (row) => row.role },
    {
      key: 'universityId',
      title: 'University',
      render: (row) => universities.find((item) => item.id === row.universityId)?.name ?? row.universityId,
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'right',
      render: (row) => (
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
      {employeesQuery.isError && <Alert color="yellow">Could not reach the employees API. Check admin session.</Alert>}
      {feedback && <Alert color="blue">{feedback}</Alert>}
      <CollectionManager
        rows={employees}
        columns={columns}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search employees"
        summary={`${employees.length} employees`}
        emptyLabel="No employees match this view."
        filter={(
          <Select
            aria-label="Filter university"
            placeholder="All universities"
            clearable
            data={universities.map((item) => ({ value: item.id, label: item.name }))}
            value={universityId}
            onChange={setUniversityId}
            w={200}
          />
        )}
      />
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
