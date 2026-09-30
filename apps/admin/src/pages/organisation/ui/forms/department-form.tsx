import { Alert, Button, Stack } from '@mantine/core'
import { formOptions } from '@tanstack/react-form'
import { useState } from 'react'
import { FormField, FormWrapper, getServerMessage } from '@digitalnotes/core'
import { departmentSchema, type DepartmentValues } from '@/entities/organisation'
import { createDepartment } from '@/shared/api/endpoints/organisation'

type Option = { value: string; label: string }

const departmentOpts = formOptions({
  defaultValues: { facultyId: '', name: '', slug: '' } satisfies DepartmentValues,
  validators: { onSubmit: departmentSchema },
})

export function DepartmentForm({ onSuccess }: Readonly<{ onSuccess?: () => void }>) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

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
        {/*<FormField.Select name="facultyId" label="Faculty" placeholder="Select faculty" data={faculties} withAsterisk />*/}
        <FormField.TextInput name="name" label="Department name" placeholder="e.g. Computer Science" withAsterisk />
        <FormField.TextInput name="slug" label="Slug" placeholder="e.g. computer-science" withAsterisk />
        <Button type="submit" loading={pending}>Create department</Button>
      </Stack>
    </FormWrapper>
  )
}
