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
import { actionKeys } from '@/shared/api/action-keys'
import { createDepartment, listFaculties, updateDepartment } from '@/shared/api/endpoints/organisation'
import { revalidateQuery } from '@/shared/api/revalidate-query'

export function DepartmentForm({
  facultyId,
  initialValue,
  onSuccess,
}: Readonly<{
  facultyId?: string
  initialValue?: { id: string; name: string }
  onSuccess?: () => void
}>) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const isEditing = Boolean(initialValue?.id)

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
        defaultValues: {
          facultyId: facultyId ?? '',
          name: initialValue?.name ?? '',
        } satisfies DepartmentValues,
        validators: { onSubmit: departmentSchema },
      }),
    [facultyId, initialValue?.name],
  )

  async function handleSubmit(value: DepartmentValues) {
    setError('')
    setPending(true)
    try {
      if (isEditing && initialValue?.id) {
        const result = (await updateDepartment(initialValue.id, value)) as {
          status?: string
          error?: { message?: string }
        } | null
        if (result !== null && typeof result === 'object' && 'status' in result && result.status === 'error') {
          throw new Error(result.error?.message ?? 'Could not update department.')
        }
      } else {
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
      }
      await revalidateQuery(actionKeys.listDepartments)
      onSuccess?.()
    } catch (submitError) {
      setError(getServerMessage(submitError, 'Could not save. Try again.'))
    } finally {
      setPending(false)
    }
  }

  return (
    <FormWrapper key={initialValue?.id ?? 'new'} formOptions={departmentOpts} onSubmit={handleSubmit}>
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
        <Button type="submit" loading={pending}>{isEditing ? 'Save changes' : 'Create department'}</Button>
      </Stack>
    </FormWrapper>
  )
}
