export type NoteStatus =
  | 'DRAFT'
  | 'CONVERTED'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED'

export type NoteType =
  | 'LECTURE_NOTES'
  | 'SUMMARY'
  | 'REVISION'
  | 'PAST_EXAM'
  | 'EXERCISES'

export const noteStatuses: NoteStatus[] = [
  'DRAFT',
  'CONVERTED',
  'PENDING_REVIEW',
  'PUBLISHED',
  'REJECTED',
  'ARCHIVED',
]

export const noteTypes: NoteType[] = [
  'LECTURE_NOTES',
  'SUMMARY',
  'REVISION',
  'PAST_EXAM',
  'EXERCISES',
]

export type NoteListItem = {
  id: string
  title: string
  noteType: NoteType
  price: number
  status: NoteStatus
  uploadedBy: string
  providedAt: string | null
  pageCount: number
  createdAt: string
  updatedAt: string
}
