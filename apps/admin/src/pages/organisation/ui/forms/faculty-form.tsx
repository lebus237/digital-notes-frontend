import { Alert, Button, Stack } from '@mantine/core'
import { formOptions } from '@tanstack/react-form'
import { useState } from 'react'
import { FormField, FormWrapper, getServerMessage } from '@digitalnotes/core'
import { facultySchema, type FacultyValues } from '@/entities/organisation'
import { createFaculty } from '@/shared/api/endpoints/organisation'

type Option = { value: string; label: string }

const facultyOpts = formOptions({
  defaultValues: { universityId: '', name: '', slug: '' } satisfies FacultyValues,
  validators: { onSubmit: facultySchema },
})

export function FacultyForm({ onSuccess }: Readonly<{onSuccess?: () => void }>) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

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
        {/*<FormField.Select name="universityId" label="University" placeholder="Select university" data={universities} withAsterisk />*/}
        <FormField.TextInput name="name" label="Faculty name" placeholder="e.g. Faculty of Science" withAsterisk />
        <FormField.TextInput name="slug" label="Slug" placeholder="e.g. faculty-of-science" withAsterisk />
        <Button type="submit" loading={pending}>Create faculty</Button>
      </Stack>
    </FormWrapper>
  )
}
