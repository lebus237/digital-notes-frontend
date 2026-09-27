import { Text, Title } from '@mantine/core'
import type { Note } from '../model/note'
import styles from './note-list.module.scss'

export function NoteList({ notes }: Readonly<{ notes: Note[] }>) {
  if (notes.length === 0) {
    return (
      <div className={styles.empty}>
        <Title order={3}>No notes yet</Title>
        <Text c="dimmed">Write a note above and save it to start your list.</Text>
      </div>
    )
  }

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li className={styles.note} key={note.id}>
          <div className={styles.noteHeading}>
            <Title order={3}>{note.title}</Title>
            <time dateTime={note.createdAt}>
              {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(note.createdAt))}
            </time>
          </div>
          {note.content && <Text>{note.content}</Text>}
        </li>
      ))}
    </ul>
  )
}
