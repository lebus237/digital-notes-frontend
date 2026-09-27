import { Button } from '@mantine/core'
import { useMemo, useState } from 'react'
import { initialNotes, NoteReviewTable, type Note, type NoteStatus } from '@/entities/note'
import { ManageNoteActions } from '@/features/manage-note'
import styles from './note-review.module.scss'

type StatusFilter = 'All statuses' | NoteStatus

export function NoteReview() {
  const [notes, setNotes] = useState(initialNotes)
  const [filter, setFilter] = useState<StatusFilter>('All statuses')
  const [statusMessage, setStatusMessage] = useState('')
  const [removedNote, setRemovedNote] = useState<Note | null>(null)

  const visibleNotes = useMemo(
    () => filter === 'All statuses' ? notes : notes.filter((note) => note.status === filter),
    [filter, notes],
  )

  function handleStatusChange(noteId: string, status: NoteStatus) {
    const note = notes.find((item) => item.id === noteId)
    if (!note) return
    setNotes((currentNotes) => currentNotes.map((item) => item.id === noteId ? { ...item, status } : item))
    setStatusMessage(`${note.title} marked ${status.toLowerCase()}.`)
  }

  function handleRemove(noteId: string) {
    const note = notes.find((item) => item.id === noteId)
    if (!note) return
    setNotes((currentNotes) => currentNotes.filter((item) => item.id !== noteId))
    setRemovedNote(note)
    setStatusMessage(`${note.title} removed from review.`)
  }

  function handleUndoRemove() {
    if (!removedNote) return
    setNotes((currentNotes) => [removedNote, ...currentNotes])
    setStatusMessage(`${removedNote.title} restored to review.`)
    setRemovedNote(null)
  }

  return (
    <div className={styles.review}>
      <div className={styles.toolbar}>
        <p aria-live="polite">{visibleNotes.length} {visibleNotes.length === 1 ? 'note' : 'notes'}</p>
        <label className={styles.filter}>
          <span>Filter status</span>
          <select value={filter} onChange={(event) => setFilter(event.currentTarget.value as StatusFilter)}>
            <option>All statuses</option>
            <option>Pending</option>
            <option>Published</option>
            <option>Rejected</option>
          </select>
        </label>
      </div>
      <div className={styles.feedback}>
        <p className={styles.statusMessage} role="status" aria-live="polite">{statusMessage}</p>
        {removedNote && (
          <Button type="button" variant="subtle" size="xs" onClick={handleUndoRemove}>
            Undo remove
          </Button>
        )}
      </div>
      <NoteReviewTable
        notes={visibleNotes}
        renderActions={(note) => (
          <ManageNoteActions note={note} onStatusChange={handleStatusChange} onRemove={handleRemove} />
        )}
      />
    </div>
  )
}
