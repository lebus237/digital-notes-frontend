import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { createNote, initialNotes, type CreateNoteInput, type Note } from './note'

type NotesContextValue = {
  notes: Note[]
  addNote: (input: CreateNoteInput) => void
}

const NotesContext = createContext<NotesContextValue | null>(null)

export function NotesProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const addNote = useCallback((input: CreateNoteInput) => {
    setNotes((current) => [createNote(input), ...current])
  }, [])
  const value = useMemo(() => ({ notes, addNote }), [notes, addNote])

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider')
  }
  return context
}
