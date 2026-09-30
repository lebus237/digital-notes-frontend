import { Alert, Button, Stack } from '@mantine/core'
import { formOptions } from '@tanstack/react-form'
import { useState } from 'react'
import { FormField, FormWrapper, getServerMessage } from '@digitalnotes/core'
import { semesterSchema, type SemesterValues } from '@/entities/organisation'
import { createSemester } from '@/shared/api/endpoints/organisation'

const semesterOpts = formOptions({
  defaultValues: { name: '' } satisfies SemesterValues,
  validators: { onSubmit: semesterSchema },
})

export function SemesterForm({ onSuccess }: Readonly<{ onSuccess?: () => void }>) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(value: SemesterValues) {
    setError('')
    setPending(true)
    try {
      const result = (await createSemester(value)) as {
        id?: string
        status?: string
        error?: { message?: string }
      }
      if (result !== null && typeof result === 'object' && 'status' in result && result.status === 'error') {
        throw new Error(result.error?.message ?? 'Could not create semester.')
      }
      if (!result?.id) {
        throw new Error(result?.error?.message ?? 'Could not create semester.')
      }
      onSuccess?.()
    } catch (submitError) {
      setError(getServerMessage(submitError, 'Could not save. Try again.'))
    } finally {
      setPending(false)
    }
  }

  return (
    <FormWrapper formOptions={semesterOpts} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        <FormField.TextInput name="name" label="Semester name" placeholder="e.g. First Semester" withAsterisk />
        <Button type="submit" loading={pending}>Create semester</Button>
      </Stack>
    </FormWrapper>
  )
}
