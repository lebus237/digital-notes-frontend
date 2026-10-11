import { Alert, Button, Stack } from '@mantine/core'
import { formOptions } from '@tanstack/react-form'
import { useState } from 'react'
import { FormField, FormWrapper, getServerMessage } from '@digitalnotes/core'
import { employeeSchema, type EmployeeValues } from '@/entities/employee'
import { createEmployee } from '@/shared/api/endpoints/employees'

type Option = { value: string; label: string }

const employeeOpts = formOptions({
  defaultValues: {
    universityId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    role: '',
  } satisfies EmployeeValues,
  validators: { onSubmit: employeeSchema },
})

export function EmployeeForm({ universities, roles, onSuccess }: Readonly<{ universities: Option[]; roles: Option[]; onSuccess?: () => void }>) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(value: EmployeeValues) {
    setError('')
    setPending(true)
    try {
      const result = (await createEmployee(value)) as unknown
      if (
        result !== null &&
        typeof result === 'object' &&
        'status' in result &&
        (result as { status?: string }).status === 'error'
      ) {
        throw new Error((result as { error?: { message?: string } }).error?.message ?? 'Could not create employee.')
      }
      onSuccess?.()
    } catch (submitError) {
      setError(getServerMessage(submitError, 'Could not create employee.'))
    } finally {
      setPending(false)
    }
  }

  return (
    <FormWrapper formOptions={employeeOpts} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        <FormField.Select name="universityId" label="University" placeholder="Select university" data={universities} withAsterisk />
        <FormField.TextInput name="fullName" label="Full name" placeholder="e.g. Adaeze Okafor" withAsterisk />
        <FormField.Email name="email" label="Email" placeholder="name@university.edu" withAsterisk />
        <FormField.TextInput name="phoneNumber" label="Phone number" placeholder="e.g. 08012345678" withAsterisk />
        <FormField.Select name="role" label="Role" placeholder="Select role" data={roles} withAsterisk />
        <Button type="submit" loading={pending}>Create employee</Button>
      </Stack>
    </FormWrapper>
  )
}
