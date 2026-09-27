import { Button, Group, Select } from '@mantine/core'
import type { Note, NoteStatus } from '@/entities/note'
import styles from './manage-note-actions.module.scss'

type ManageNoteActionsProps = {
  note: Note
  onStatusChange: (noteId: string, status: NoteStatus) => void
  onRemove: (noteId: string) => void
}

export function ManageNoteActions({ note, onStatusChange, onRemove }: Readonly<ManageNoteActionsProps>) {
  return (
    <Group className={styles.actions} gap="xs" wrap="nowrap">
      <Select
        aria-label={`Change status for ${note.title}`}
        data={['Pending', 'Published', 'Rejected']}
        value={note.status}
        onChange={(value) => {
          if (value) onStatusChange(note.id, value as NoteStatus)
        }}
        size="sm"
        w={130}
        allowDeselect={false}
      />
      <Button
        type="button"
        variant="subtle"
        color="red"
        size="sm"
        onClick={() => onRemove(note.id)}
        aria-label={`Remove ${note.title}`}
      >
        Remove
      </Button>
    </Group>
  )
}
