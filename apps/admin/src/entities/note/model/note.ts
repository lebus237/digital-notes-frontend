export type NoteStatus = 'Pending' | 'Published' | 'Rejected'

export type Note = {
  id: string
  title: string
  author: string
  updatedAt: string
  status: NoteStatus
}

export const initialNotes: Note[] = [
  { id: 'note-1', title: 'Field notes from the coast', author: 'Mara Chen', updatedAt: '2026-09-26T10:15:00.000Z', status: 'Pending' },
  { id: 'note-2', title: 'A better morning routine', author: 'Jon Bell', updatedAt: '2026-09-25T14:30:00.000Z', status: 'Published' },
  { id: 'note-3', title: 'Research links for chapter two', author: 'Priya Shah', updatedAt: '2026-09-24T08:05:00.000Z', status: 'Pending' },
  { id: 'note-4', title: 'Duplicate event notes', author: 'Alex Rivera', updatedAt: '2026-09-22T16:45:00.000Z', status: 'Rejected' },
]
