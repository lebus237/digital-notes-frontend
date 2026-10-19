import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Alert, Button, Stack } from '@mantine/core'
import { formOptions } from '@tanstack/react-form'
import {
  FormField,
  FormWrapper,
  getServerMessage,
  normalizeCollectionResponse,
} from '@digitalnotes/core'
import { departmentSchema, type DepartmentValues } from '@/entities/organisation'
import { createDepartment, listFaculties } from '@/shared/api/endpoints/organisation'

export function DepartmentForm({
  facultyId,
  onSuccess,
}: Readonly<{ facultyId?: string; onSuccess?: () => void }>) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const { data: faculties = [] } = useQuery({
    queryKey: ['admin-faculties', 'options'],
    enabled: !facultyId,
    staleTime: 60_000,
    queryFn: () => listFaculties({ pagination: { page: 1, limit: 100 } }),
    select: (payload) => normalizeCollectionResponse<{ id: string; name: string }>(payload).data,
  })

  const departmentOpts = useMemo(
    () =>
      formOptions({
        defaultValues: { facultyId: facultyId ?? '', name: '' } satisfies DepartmentValues,
        validators: { onSubmit: departmentSchema },
      }),
    [facultyId],
  )

  async function handleSubmit(value: DepartmentValues) {
    setError('')
    setPending(true)
    try {
      const result = (await createDepartment(value)) as {
        id?: string
        status?: string
        error?: { message?: string }
      }
      if (result !== null && typeof result === 'object' && 'status' in result && result.status === 'error') {
        throw new Error(result.error?.message ?? 'Could not create department.')
      }
      if (!result?.id) {
        throw new Error(result?.error?.message ?? 'Could not create department.')
      }
      onSuccess?.()
    } catch (submitError) {
      setError(getServerMessage(submitError, 'Could not save. Try again.'))
    } finally {
      setPending(false)
    }
  }

  return (
    <FormWrapper formOptions={departmentOpts} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        {!facultyId && (
          <FormField.Select
            name="facultyId"
            label="Faculty"
            placeholder="Select faculty"
            data={faculties.map((item) => ({ value: item.id, label: item.name }))}
            withAsterisk
          />
        )}
        <FormField.TextInput name="name" label="Department name" placeholder="e.g. Computer Science" withAsterisk />
        <Button type="submit" loading={pending}>Create department</Button>
      </Stack>
    </FormWrapper>
  )
}
