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
import { facultySchema, type FacultyValues } from '@/entities/organisation'
import { createFaculty, listUniversities } from '@/shared/api/endpoints/organisation'

export function FacultyForm({
  universityId,
  onSuccess,
}: Readonly<{ universityId?: string; onSuccess?: () => void }>) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const { data: universities = [] } = useQuery({
    queryKey: ['admin-universities', 'options'],
    enabled: !universityId,
    staleTime: 60_000,
    queryFn: () => listUniversities({ pagination: { page: 1, limit: 100 } }),
    select: (payload) => normalizeCollectionResponse<{ id: string; name: string }>(payload).data,
  })

  const facultyOpts = useMemo(
    () =>
      formOptions({
        defaultValues: { universityId: universityId ?? '', name: '' } satisfies FacultyValues,
        validators: { onSubmit: facultySchema },
      }),
    [universityId],
  )

  async function handleSubmit(value: FacultyValues) {
    setError('')
    setPending(true)
    try {
      const result = (await createFaculty(value)) as {
        id?: string
        status?: string
        error?: { message?: string }
      }
      if (result !== null && typeof result === 'object' && 'status' in result && result.status === 'error') {
        throw new Error(result.error?.message ?? 'Could not create faculty.')
      }
      if (!result?.id) {
        throw new Error(result?.error?.message ?? 'Could not create faculty.')
      }
      onSuccess?.()
    } catch (submitError) {
      setError(getServerMessage(submitError, 'Could not save. Try again.'))
    } finally {
      setPending(false)
    }
  }

  return (
    <FormWrapper formOptions={facultyOpts} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        {!universityId && (
          <FormField.Select
            name="universityId"
            label="University"
            placeholder="Select university"
            data={universities.map((item) => ({ value: item.id, label: item.name }))}
            withAsterisk
          />
        )}
        <FormField.TextInput name="name" label="Faculty name" placeholder="e.g. Faculty of Science" withAsterisk />
        <Button type="submit" loading={pending}>Create faculty</Button>
      </Stack>
    </FormWrapper>
  )
}
