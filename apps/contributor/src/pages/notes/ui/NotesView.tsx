import { Button, Select } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useRouterState } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  noteStatuses,
  noteStatusLabels,
  noteTypeLabels,
  useNotes,
  type Note,
  type NoteStatus,
} from '@/entities/note'
import { CreateNoteForm } from '@/features/create-note'
import { CollectionManager, type CollectionColumn } from '@/widgets/collection'
import { PageContainer } from '@/widgets/page-container'
import styles from './notes-view.module.scss'

const statusClass: Record<NoteStatus, string> = {
  DRAFT: styles.draft,
  PENDING_REVIEW: styles.pendingReview,
  PUBLISHED: styles.published,
  REJECTED: styles.rejected,
  ARCHIVED: styles.archived,
}

const columns: Array<CollectionColumn<Note>> = [
  {
    key: 'title',
    title: 'Note',
    render: (note) => <span className={styles.title}>{note.title}</span>,
  },
  {
    key: 'type',
    title: 'Type',
    render: (note) => noteTypeLabels[note.noteType],
  },
  {
    key: 'status',
    title: 'Status',
    render: (note) => (
      <span className={`${styles.status} ${statusClass[note.status]}`}>
        <span className={styles.statusDot} aria-hidden="true" />
        {noteStatusLabels[note.status]}
      </span>
    ),
  },
  {
    key: 'updated',
    title: 'Updated',
    render: (note) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(note.updatedAt)),
  },
]

export function NotesView() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const creating = pathname === '/submit'
  const { notes, addNote } = useNotes()
  const [panelOpen, setPanelOpen] = useState(creating)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<NoteStatus | 'ALL'>('ALL')

  useEffect(() => {
    setPanelOpen(creating)
  }, [creating])

  const breadcrumbs = useMemo(
    () => creating
      ? [
          { label: 'Home', to: '/' as const },
          { label: 'Notes', to: '/' as const },
          { label: 'Submit' },
        ]
      : [
          { label: 'Home', to: '/' as const },
          { label: 'Notes' },
        ],
    [creating],
  )

  const visibleNotes = useMemo(() => {
    const query = search.trim().toLowerCase()
    return notes.filter((note) => {
      const matchesQuery = query === ''
        || note.title.toLowerCase().includes(query)
        || note.description.toLowerCase().includes(query)
      const matchesStatus = status === 'ALL' || note.status === status
      return matchesQuery && matchesStatus
    })
  }, [notes, search, status])

  return (
    <PageContainer
      breadcrumbs={breadcrumbs}
      actions={(
        <Button leftSection={<IconPlus size={18} />} onClick={() => setPanelOpen(true)}>
          New note
        </Button>
      )}
      panel={{
        opened: panelOpen,
        title: 'New note',
        onClose: () => setPanelOpen(false),
        children: (
          <CreateNoteForm
            onCreate={(input) => {
              addNote(input)
              setPanelOpen(false)
            }}
          />
        ),
      }}
    >
      <CollectionManager
        rows={visibleNotes}
        columns={columns}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search notes"
        summary={`${visibleNotes.length} ${visibleNotes.length === 1 ? 'note' : 'notes'}`}
        emptyLabel="No notes match this view."
        filter={(
          <Select
            aria-label="Filter status"
            value={status}
            onChange={(value) => setStatus((value ?? 'ALL') as NoteStatus | 'ALL')}
            allowDeselect={false}
            data={[
              { value: 'ALL', label: 'All statuses' },
              ...noteStatuses.map((item) => ({ value: item, label: noteStatusLabels[item] })),
            ]}
            w={180}
          />
        )}
      />
    </PageContainer>
  )
}
