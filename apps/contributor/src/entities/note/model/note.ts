export type NoteType = 'LECTURE_NOTES' | 'SUMMARY' | 'REVISION' | 'PAST_EXAM' | 'EXERCISES'

export type NoteStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED'

export type Note = {
  id: string
  title: string
  description: string
  noteType: NoteType
  status: NoteStatus
  updatedAt: string
}

export type CreateNoteInput = {
  title: string
  description: string
  noteType: NoteType
}

export const noteTypeLabels: Record<NoteType, string> = {
  LECTURE_NOTES: 'Lecture notes',
  SUMMARY: 'Summary',
  REVISION: 'Revision',
  PAST_EXAM: 'Past exam',
  EXERCISES: 'Exercises',
}

export const noteStatusLabels: Record<NoteStatus, string> = {
  DRAFT: 'Draft',
  PENDING_REVIEW: 'Pending review',
  PUBLISHED: 'Published',
  REJECTED: 'Rejected',
  ARCHIVED: 'Archived',
}

export const noteTypes = Object.keys(noteTypeLabels) as NoteType[]
export const noteStatuses = Object.keys(noteStatusLabels) as NoteStatus[]

export const initialNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Coastal ecology lecture',
    description: 'Week 4 notes on shoreline habitats.',
    noteType: 'LECTURE_NOTES',
    status: 'PENDING_REVIEW',
    updatedAt: '2026-09-26T10:15:00.000Z',
  },
  {
    id: 'note-2',
    title: 'Chapter two summary',
    description: 'Condensed reading notes for the seminar.',
    noteType: 'SUMMARY',
    status: 'PUBLISHED',
    updatedAt: '2026-09-25T14:30:00.000Z',
  },
  {
    id: 'note-3',
    title: 'Past paper set A',
    description: 'Worked answers from the 2024 sitting.',
    noteType: 'PAST_EXAM',
    status: 'DRAFT',
    updatedAt: '2026-09-24T08:05:00.000Z',
  },
  {
    id: 'note-4',
    title: 'Problem set 3',
    description: 'Practice exercises with short solutions.',
    noteType: 'EXERCISES',
    status: 'REJECTED',
    updatedAt: '2026-09-22T16:45:00.000Z',
  },
]

export function createNote(input: CreateNoteInput): Note {
  return {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    noteType: input.noteType,
    status: 'PENDING_REVIEW',
    updatedAt: new Date().toISOString(),
  }
}
