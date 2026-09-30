import { Alert, Button, Stack } from '@mantine/core'
import { formOptions } from '@tanstack/react-form'
import { useState } from 'react'
import { FormField, FormWrapper, getServerMessage } from '@digitalnotes/core'
import { noteMetadataSchema, type NoteMetadataValues } from '@/entities/note'
import { updateNoteMetadata } from '@/shared/api/endpoints/notes'

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
      const result = (await updateNoteMetadata(noteId, {
        title: value.title,
        description: value.description === '' ? null : (value.description ?? null),
        price: value.price,
      })) as unknown
      if (
        result !== null &&
        typeof result === 'object' &&
        'status' in result &&
        (result as { status?: string }).status === 'error'
      ) {
        throw new Error((result as { error?: { message?: string } }).error?.message ?? 'Could not update note.')
      }
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
