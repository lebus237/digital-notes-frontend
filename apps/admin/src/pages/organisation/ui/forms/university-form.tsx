import { Alert, Button, Stack } from '@mantine/core'
import { formOptions } from '@tanstack/react-form'
import { useState } from 'react'
import { FormField, FormWrapper, getServerMessage } from '@digitalnotes/core'
import { universitySchema, type UniversityValues } from '@/entities/organisation'
import { createUniversity } from '@/shared/api/endpoints/organisation'

const universityOpts = formOptions({
  defaultValues: { name: '', slug: '' } satisfies UniversityValues,
  validators: { onSubmit: universitySchema },
})

export function UniversityForm({ onSuccess }: Readonly<{ onSuccess?: () => void }>) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(value: UniversityValues) {
    setError('')
    setPending(true)
    try {
      const result = (await createUniversity(value)) as {
        id?: string
        status?: string
        error?: { message?: string }
      }
      if (result !== null && typeof result === 'object' && 'status' in result && result.status === 'error') {
        throw new Error(result.error?.message ?? 'Could not create university.')
      }
      if (!result?.id) {
        throw new Error(result?.error?.message ?? 'Could not create university.')
      }
      onSuccess?.()
    } catch (submitError) {
      setError(getServerMessage(submitError, 'Could not save. Try again.'))
    } finally {
      setPending(false)
    }
  }

  return (
    <FormWrapper formOptions={universityOpts} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        <FormField.TextInput name="name" label="University name" placeholder="e.g. University of Lagos" withAsterisk />
        <FormField.TextInput name="slug" label="Slug" placeholder="e.g. university-of-lagos" withAsterisk />
        <Button type="submit" loading={pending}>Create university</Button>
      </Stack>
    </FormWrapper>
  )
}
