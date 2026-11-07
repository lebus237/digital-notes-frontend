import { useMemo, useState } from 'react'
import { Alert, Button, Stack } from '@mantine/core'
import { formOptions } from '@tanstack/react-form'
import {
  FormField,
  FormWrapper,
  getServerMessage,
} from '@digitalnotes/core'
import { facultySchema, type FacultyValues } from '@/entities/organisation'
import { actionKeys } from '@/shared/api/action-keys'
import { createFaculty, listUniversities, updateFaculty } from '@/shared/api/endpoints/organisation'
import { revalidateQuery } from '@/shared/api/revalidate-query'

export function FacultyForm({
  universityId,
  initialValue,
  onSuccess,
}: Readonly<{
  universityId?: string
  initialValue?: { id: string; name: string }
  onSuccess?: () => void
}>) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const isEditing = Boolean(initialValue?.id)

  const facultyOpts = useMemo(
    () =>
      formOptions({
        defaultValues: {
          universityId: universityId ?? '',
          name: initialValue?.name ?? '',
        } satisfies FacultyValues,
        validators: { onSubmit: facultySchema },
      }),
    [universityId, initialValue?.name],
  )

  async function handleSubmit(value: FacultyValues) {
    setError('')
    setPending(true)
    try {
      if (isEditing && initialValue?.id) {
        const result = (await updateFaculty(initialValue.id, value)) as {
          status?: string
          error?: { message?: string }
        } | null
        if (result !== null && typeof result === 'object' && 'status' in result && result.status === 'error') {
          throw new Error(result.error?.message ?? 'Could not update faculty.')
        }
      } else {
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
      }
      await revalidateQuery(actionKeys.listFaculties)
      onSuccess?.()
    } catch (submitError) {
      setError(getServerMessage(submitError, 'Could not save. Try again.'))
    } finally {
      setPending(false)
    }
  }

  return (
    <FormWrapper key={initialValue?.id ?? 'new'} formOptions={facultyOpts} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        {!universityId && (
          <FormField.AsyncAutocomplete
            name="universityId"
            label="University"
            placeholder="Select university"
            fetchApi={listUniversities}
            cacheKey="admin-universities-options"
            withAsterisk
          />
        )}
        <FormField.TextInput name="name" label="Faculty name" placeholder="e.g. Faculty of Science" withAsterisk />
        <Button type="submit" loading={pending}>{isEditing ? 'Save changes' : 'Create faculty'}</Button>
      </Stack>
    </FormWrapper>
  )
}
