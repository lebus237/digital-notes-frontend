import { Alert, Button, Stack } from '@mantine/core'
import { formOptions } from '@tanstack/react-form'
import { useState } from 'react'
import { FormField, FormWrapper, getServerMessage } from '@digitalnotes/core'
import { noteApi, noteMetadataSchema, type NoteMetadataValues } from '@/entities/note'

const metadataOpts = formOptions({
  defaultValues: { title: '', description: '', price: 0 } satisfies NoteMetadataValues,
  validators: { onSubmit: noteMetadataSchema },
})

export function NoteMetadataForm({ noteId, initial, onSuccess }: Readonly<{ noteId: string; initial?: Partial<NoteMetadataValues>; onSuccess?: () => void }>) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const options = formOptions({
    defaultValues: { ...metadataOpts.defaultValues, ...initial },
    validators: { onSubmit: noteMetadataSchema },
  })

  async function handleSubmit(value: NoteMetadataValues) {
    setError('')
    setPending(true)
    try {
      await noteApi.updateMetadata(noteId, value)
      onSuccess?.()
    } catch (submitError) {
      setError(getServerMessage(submitError, 'Could not update note.'))
    } finally {
      setPending(false)
    }
  }

  return (
    <FormWrapper formOptions={options} onSubmit={handleSubmit}>
      <Stack gap="sm">
        {error && <Alert color="red">{error}</Alert>}
        <FormField.TextInput name="title" label="Title" placeholder="Note title" withAsterisk />
        <FormField.TextArea name="description" label="Description" placeholder="Optional description" minRows={2} />
        <FormField.NumberInput name="price" label="Price" placeholder="0" min={0} withAsterisk />
        <Button type="submit" loading={pending}>Save changes</Button>
      </Stack>
    </FormWrapper>
  )
}
