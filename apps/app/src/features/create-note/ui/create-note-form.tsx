import { Button, Stack, Textarea, TextInput } from '@mantine/core'
import { useRef, useState, type FormEvent } from 'react'
import styles from './create-note-form.module.scss'

type CreateNoteFormProps = {
  onCreate: (title: string, content: string) => void
}

export function CreateNoteForm({ onCreate }: Readonly<CreateNoteFormProps>) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const titleInput = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) {
      setError('Enter a title before saving your note.')
      titleInput.current?.focus()
      return
    }

    onCreate(title, content)
    setTitle('')
    setContent('')
    setError('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Stack gap="md">
        <TextInput
          ref={titleInput}
          label="Title"
          value={title}
          onChange={(event) => {
            setTitle(event.currentTarget.value)
            if (event.currentTarget.value.trim()) setError('')
          }}
          error={error}
          aria-invalid={Boolean(error)}
          required
        />
        <Textarea
          label="Note"
          value={content}
          onChange={(event) => setContent(event.currentTarget.value)}
          minRows={3}
          autosize
        />
        <div>
          <Button type="submit">Save note</Button>
        </div>
      </Stack>
    </form>
  )
}
