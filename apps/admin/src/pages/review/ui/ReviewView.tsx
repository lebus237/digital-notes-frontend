import { Alert, Button, Group, Modal, Select } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { courseApi } from '@/entities/course'
import { initialNotes, noteApi, type Note, type NoteStatus } from '@/entities/note'
import { ManageNoteActions, NoteMetadataForm } from '@/features/manage-note'
import { CollectionManager, type CollectionColumn } from '@/widgets/collection'
import { PageContainer } from '@/widgets/page-container'
import { queryKeys } from '@/shared/api/query-client'
import styles from './review-view.module.scss'

type StatusFilter = 'All statuses' | NoteStatus

const statusClass: Record<NoteStatus, string> = {
  Pending: styles.pending,
  Published: styles.published,
  Rejected: styles.rejected,
}

const breadcrumbs = [
  { label: 'Home', to: '/' as const },
  { label: 'Note review' },
]

export function ReviewView() {
  const queryClient = useQueryClient()
  const [courseId, setCourseId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('All statuses')
  const [statusMessage, setStatusMessage] = useState('')
  const [editing, setEditing] = useState<Note | null>(null)

  const coursesQuery = useQuery({ queryKey: queryKeys.courses({}), queryFn: () => courseApi.list({}) })
  const notesQuery = useQuery({
    queryKey: queryKeys.notes(courseId ?? undefined, search),
    queryFn: () => (courseId ? noteApi.listByCourse(courseId, { search }) : Promise.resolve(initialNotes)),
  })

  const courses = coursesQuery.data ?? []
  const notes = useMemo(() => notesQuery.data ?? [], [notesQuery.data])

  const query = search.trim().toLowerCase()
  const visibleNotes = notes.filter((note) => {
    const matchesQuery = query === ''
      || note.title.toLowerCase().includes(query)
      || note.author.toLowerCase().includes(query)
    const matchesStatus = filter === 'All statuses' || note.status === filter
    return matchesQuery && matchesStatus
  })

  function invalidateNotes() {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'notes'] })
  }

  const publishMutation = useMutation({
    mutationFn: (id: string) => noteApi.publish(id),
    onSuccess: (_data, id) => {
      setStatusMessage(`Note ${id} published.`)
      invalidateNotes()
    },
    onError: (error) => setStatusMessage(error instanceof Error ? error.message : 'Could not publish note.'),
  })
  const rejectMutation = useMutation({
    mutationFn: (id: string) => noteApi.reject(id),
    onSuccess: (_data, id) => {
      setStatusMessage(`Note ${id} rejected.`)
      invalidateNotes()
    },
    onError: (error) => setStatusMessage(error instanceof Error ? error.message : 'Could not reject note.'),
  })
  const archiveMutation = useMutation({
    mutationFn: (id: string) => noteApi.archive(id),
    onSuccess: () => {
      setStatusMessage('Note archived.')
      invalidateNotes()
    },
    onError: (error) => setStatusMessage(error instanceof Error ? error.message : 'Could not archive note.'),
  })

  function handleStatusChange(noteId: string, status: NoteStatus) {
    if (status === 'Published') publishMutation.mutate(noteId)
    else if (status === 'Rejected') rejectMutation.mutate(noteId)
    else setStatusMessage('Pending is the default review state.')
  }

  const columns: Array<CollectionColumn<Note>> = [
    {
      key: 'title',
      title: 'Note',
      render: (note) => <span className={styles.title}>{note.title}</span>,
    },
    {
      key: 'author',
      title: 'Author',
      render: (note) => note.author,
    },
    {
      key: 'updated',
      title: 'Updated',
      render: (note) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(note.updatedAt)),
    },
    {
      key: 'status',
      title: 'Status',
      render: (note) => (
        <span className={`${styles.status} ${statusClass[note.status]}`}>
          <span className={styles.statusDot} aria-hidden="true" />
          {note.status}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (note) => (
        <Group gap="xs" wrap="nowrap">
          <ManageNoteActions note={note} onStatusChange={handleStatusChange} onRemove={(id) => archiveMutation.mutate(id)} />
          <Button type="button" variant="light" size="sm" onClick={() => setEditing(note)}>
            Edit
          </Button>
        </Group>
      ),
    },
  ]

  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      actions={(
        <div className={styles.feedback}>
          <p className={styles.statusMessage} role="status" aria-live="polite">{statusMessage}</p>
        </div>
      )}
    >
      {!courseId && (
        <Alert color="blue">
          Select a course to review live notes from <code>/api/v1/courses/:courseId/notes</code>. Showing bundled sample data until then.
        </Alert>
      )}
      {notesQuery.isError && <Alert color="yellow">Could not reach the notes API. Check admin session.</Alert>}
      <CollectionManager
        rows={visibleNotes}
        columns={columns}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search notes"
        summary={`${visibleNotes.length} ${visibleNotes.length === 1 ? 'note' : 'notes'}`}
        emptyLabel="No notes match this view."
        filter={(
          <Group gap="xs" wrap="nowrap">
            <Select
              aria-label="Select course"
              placeholder="Select course"
              clearable
              data={courses.map((course) => ({ value: course.id, label: `${course.code} — ${course.name}` }))}
              value={courseId}
              onChange={setCourseId}
              w={240}
            />
            <Select
              aria-label="Filter status"
              value={filter}
              onChange={(value) => setFilter((value ?? 'All statuses') as StatusFilter)}
              allowDeselect={false}
              data={['All statuses', 'Pending', 'Published', 'Rejected']}
              w={180}
            />
          </Group>
        )}
      />
      <Modal opened={editing !== null} onClose={() => setEditing(null)} title={editing ? `Edit “${editing.title}”` : 'Edit note'} centered>
        {editing && (
          <NoteMetadataForm
            noteId={editing.id}
            initial={{ title: editing.title }}
            onSuccess={() => {
              setEditing(null)
              setStatusMessage(`${editing.title} updated.`)
              invalidateNotes()
            }}
          />
        )}
      </Modal>
    </PageContainer>
  )
}
