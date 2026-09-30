import { Button, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useState, type FormEvent } from 'react'
import { noteTypeLabels, noteTypes, type CreateNoteInput, type NoteType } from '@/entities/note'
import styles from './create-note-form.module.scss'

type CreateNoteFormProps = {
  onCreate: (input: CreateNoteInput) => void
}

export function CreateNoteForm({ onCreate }: Readonly<CreateNoteFormProps>) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [noteType, setNoteType] = useState<NoteType>('LECTURE_NOTES')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (title.trim().length < 2) {
      setError('Enter a title of at least 2 characters.')
      return
    }

    onCreate({ title, description, noteType })
    setTitle('')
    setDescription('')
    setNoteType('LECTURE_NOTES')
    setError('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Stack gap="md">
        <TextInput
          label="Title"
          value={title}
          onChange={(event) => {
            setTitle(event.currentTarget.value)
            if (event.currentTarget.value.trim().length >= 2) setError('')
          }}
          error={error}
          required
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          minRows={4}
          autosize
        />
        <Select
          label="Note type"
          value={noteType}
          onChange={(value) => {
            if (value) setNoteType(value as NoteType)
          }}
          data={noteTypes.map((type) => ({ value: type, label: noteTypeLabels[type] }))}
          allowDeselect={false}
        />
        <Button type="submit">Submit note</Button>
      </Stack>
    </form>
  )
}
