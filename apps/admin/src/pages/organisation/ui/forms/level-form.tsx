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
import { levelSchema, type LevelValues } from '@/entities/organisation'
import { actionKeys } from '@/shared/api/action-keys'
import { createLevel, listDepartments } from '@/shared/api/endpoints/organisation'
import { revalidateQuery } from '@/shared/api/revalidate-query'

export function LevelForm({
  departmentId,
  onSuccess,
}: Readonly<{ departmentId?: string; onSuccess?: () => void }>) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const { data: departments = [] } = useQuery({
    queryKey: ['admin-departments', 'options'],
    enabled: !departmentId,
    staleTime: 60_000,
    queryFn: () => listDepartments({ pagination: { page: 1, limit: 100 } }),
    select: (payload) => normalizeCollectionResponse<{ id: string; name: string }>(payload).data,
  })

  const levelOpts = useMemo(
    () =>
      formOptions({
        defaultValues: { departmentId: departmentId ?? '', name: '' } satisfies LevelValues,
        validators: { onSubmit: levelSchema },
      }),
    [departmentId],
  )

  async function handleSubmit(value: LevelValues) {
    setError('')
    setPending(true)
    try {
      const result = (await createLevel(value)) as {
        id?: string
        status?: string
        error?: { message?: string }
      }
      if (result !== null && typeof result === 'object' && 'status' in result && result.status === 'error') {
        throw new Error(result.error?.message ?? 'Could not create level.')
      }
      if (!result?.id) {
        throw new Error(result?.error?.message ?? 'Could not create level.')
      }
      await revalidateQuery(actionKeys.listLevels)
      onSuccess?.()
    } catch (submitError) {
      setError(getServerMessage(submitError, 'Could not save. Try again.'))
    } finally {
      setPending(false)
    }
  }

  return (
    <FormWrapper formOptions={levelOpts} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        {!departmentId && (
          <FormField.Select
            name="departmentId"
            label="Department"
            placeholder="Select department"
            data={departments.map((item) => ({ value: item.id, label: item.name }))}
            withAsterisk
          />
        )}
        <FormField.TextInput name="name" label="Level name" placeholder="e.g. 100 Level" withAsterisk />
        <Button type="submit" loading={pending}>Create level</Button>
      </Stack>
    </FormWrapper>
  )
}
