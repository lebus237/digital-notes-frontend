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
import { CollectionManager, type TableColumn } from '@digitalnotes/core'
import { PageContainer } from '@/widgets/page-container'
import styles from './notes-view.module.scss'

const statusClass: Record<NoteStatus, string> = {
  DRAFT: styles.draft,
  PENDING_REVIEW: styles.pendingReview,
  PUBLISHED: styles.published,
  REJECTED: styles.rejected,
  ARCHIVED: styles.archived,
}

const columns: TableColumn[] = [
  {
    accessor: 'title',
    title: 'Note',
    render: (note: Note) => <span className={styles.title}>{note.title}</span>,
  },
  {
    accessor: 'type',
    title: 'Type',
    render: (note: Note) => noteTypeLabels[note.noteType],
  },
  {
    accessor: 'status',
    title: 'Status',
    render: (note: Note) => (
      <span className={`${styles.status} ${statusClass[note.status]}`}>
        <span className={styles.statusDot} aria-hidden="true" />
        {noteStatusLabels[note.status]}
      </span>
    ),
  },
  {
    accessor: 'updated',
    title: 'Updated',
    render: (note: Note) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(note.updatedAt)),
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
    if (status === 'ALL') return notes
    return notes.filter((note) => note.status === status)
  }, [notes, status])

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
        limit={10}
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
