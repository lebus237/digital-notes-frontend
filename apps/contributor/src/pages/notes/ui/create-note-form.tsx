import {
  Alert,
  Button,
  FileInput,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { getServerMessage, normalizeCollectionResponse } from '@digitalnotes/core'
import {
  noteTypeLabels,
  noteTypes,
  type NoteType,
} from '@/entities/note'
import { createNote, listCourses, submitNote } from '@/shared/api/endpoints'
import type { ContributorCourse } from '../model/note'
import styles from './create-note-form.module.scss'

type CreateNoteFormProps = {
  onCreated: () => void
}

function isErrorResult(result: any): result is { status: 'error'; error?: { message?: string } } {
  return Boolean(result && typeof result === 'object' && result.status === 'error')
}

export function CreateNoteForm({ onCreated }: Readonly<CreateNoteFormProps>) {
  const [courseId, setCourseId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [noteType, setNoteType] = useState<NoteType>('LECTURE_NOTES')
  const [price, setPrice] = useState<number>(0)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState('')

  const coursesQuery = useQuery({
    queryKey: ['contributor-courses'],
    queryFn: () => listCourses({ limit: 100, page: 1 }),
    select: (payload) =>
      normalizeCollectionResponse<ContributorCourse>(payload).data,
    staleTime: 60_000,
  })

  const courses = coursesQuery.data ?? []

  const createMutation = useMutation({
    mutationFn: async () => {
      const form = new FormData()
      form.append('courseId', courseId as string)
      form.append('title', title.trim())
      if (description.trim()) form.append('description', description.trim())
      form.append('noteType', noteType)
      form.append('price', String(price))
      files.forEach((file) => form.append('pages', file))

      const created = await createNote(form)
      if (isErrorResult(created)) {
        throw new Error(created.error?.message ?? 'Could not create the note.')
      }
      if (!created?.id) {
        throw new Error('Could not create the note.')
      }

      const submitted = await submitNote(created.id, {})
      if (isErrorResult(submitted)) {
        throw new Error(submitted.error?.message ?? 'Note created but could not be submitted.')
      }

      return created.id as string
    },
    onSuccess: () => {
      setCourseId(null)
      setTitle('')
      setDescription('')
      setNoteType('LECTURE_NOTES')
      setPrice(0)
      setFiles([])
      setError('')
      onCreated()
    },
    onError: (submitError) => {
      setError(getServerMessage(submitError, 'Could not submit the note.'))
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!courseId) {
      setError('Select a course.')
      return
    }
    if (title.trim().length < 2) {
      setError('Enter a title of at least 2 characters.')
      return
    }
    if (files.length === 0) {
      setError('Add at least one page.')
      return
    }

    setError('')
    createMutation.mutate()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Stack gap="md">
        {error && <Alert color="red">{error}</Alert>}

        <Select
          label="Course"
          placeholder={
            coursesQuery.isLoading ? 'Loading courses…' : 'Choose the course this note belongs to'
          }
          value={courseId}
          onChange={setCourseId}
          data={courses.map((course) => ({
            value: course.id,
            label: `${course.code} · ${course.name}`,
          }))}
          searchable
          required
        />

        <TextInput
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
          placeholder="e.g. Data Structures — Week 4"
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          placeholder="What does this note cover?"
          minRows={3}
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

        <NumberInput
          label="Price (FCFA)"
          value={price}
          onChange={(value) => setPrice(typeof value === 'number' ? value : 0)}
          min={0}
          step={500}
          description="Set 0 to share it for free."
        />

        <FileInput
          label="Pages"
          placeholder="Select page images or PDFs"
          description="Add pages in reading order. Images and PDFs are supported."
          accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
          multiple
          clearable
          value={files.length > 0 ? files : undefined}
          onChange={(value) => setFiles(Array.isArray(value) ? value : value ? [value] : [])}
          required
        />

        {files.length > 0 && (
          <Text size="xs" c="dimmed">
            {files.length} page{files.length === 1 ? '' : 's'} selected
          </Text>
        )}

        <Button type="submit" loading={createMutation.isPending} color="brand" fullWidth>
          Submit for review
        </Button>
      </Stack>
    </form>
  )
}
