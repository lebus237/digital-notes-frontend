import { Alert, Button, Stack } from '@mantine/core'
import { formOptions } from '@tanstack/react-form'
import { useState } from 'react'
import { FormField, FormWrapper, getServerMessage } from '@digitalnotes/core'
import { levelSchema, type LevelValues } from '@/entities/organisation'
import { createLevel } from '@/shared/api/endpoints/organisation'

type Option = { value: string; label: string }

const levelOpts = formOptions({
  defaultValues: { departmentId: '', name: '' } satisfies LevelValues,
  validators: { onSubmit: levelSchema },
})

export function LevelForm({ onSuccess }: Readonly<{ onSuccess?: () => void }>) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

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
        {/*<FormField.Select name="departmentId" label="Department" placeholder="Select department" data={departments} withAsterisk />*/}
        <FormField.TextInput name="name" label="Level name" placeholder="e.g. 100 Level" withAsterisk />
        <Button type="submit" loading={pending}>Create level</Button>
      </Stack>
    </FormWrapper>
  )
}
