import { useState } from 'react'
import { createNote, NoteList, type Note } from '@/entities/note'
import { CreateNoteForm } from '@/features/create-note'
import styles from './notes-workspace.module.scss'

export function NotesWorkspace() {
  const [notes, setNotes] = useState<Note[]>([])

  function handleCreate(title: string, content: string) {
    setNotes((currentNotes) => [createNote(title, content), ...currentNotes])
  }

  return (
    <div className={styles.workspace}>
      <section aria-labelledby="create-note-heading">
        <h2 id="create-note-heading">Write a note</h2>
        <CreateNoteForm onCreate={handleCreate} />
      </section>
      <section aria-labelledby="your-notes-heading">
        <h2 id="your-notes-heading">Your notes</h2>
        <NoteList notes={notes} />
      </section>
    </div>
  )
}
