export type AdminNoteStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED'

export type AdminNoteType =
  | 'LECTURE_NOTES'
  | 'SUMMARY'
  | 'REVISION'
  | 'PAST_EXAM'
  | 'EXERCISES'

export type AdminNotePage = {
  id: string
  uploadId: string
  url: string | null
  mimeType: string | null
  size: number | null
  sortOrder: number
}

export type AdminNoteListItem = {
  id: string
  title: string
  courseCode: string
  courseName: string
  noteType: AdminNoteType
  price: number
  status: AdminNoteStatus
  pageCount: number
  uploadedBy: string
  providedAt: string | null
  createdAt: string
  updatedAt: string
}

export type AdminNoteDetail = AdminNoteListItem & {
  courseId: string
  description: string | null
  publishedAt: string | null
  archivedAt: string | null
  pages: AdminNotePage[]
}

export const NOTE_STATUS_META: Record<
  AdminNoteStatus,
  { label: string; color: string; dot: string }
> = {
  DRAFT: { label: 'Draft', color: 'gray', dot: 'var(--mantine-color-gray-5)' },
  PENDING_REVIEW: {
    label: 'Pending review',
    color: 'yellow',
    dot: 'var(--mantine-color-yellow-6)',
  },
  PUBLISHED: { label: 'Published', color: 'green', dot: 'var(--mantine-color-green-6)' },
  REJECTED: { label: 'Rejected', color: 'red', dot: 'var(--mantine-color-red-6)' },
  ARCHIVED: { label: 'Archived', color: 'dark', dot: 'var(--mantine-color-dark-4)' },
}

export const NOTE_TYPE_LABELS: Record<AdminNoteType, string> = {
  LECTURE_NOTES: 'Lecture notes',
  SUMMARY: 'Summary',
  REVISION: 'Revision',
  PAST_EXAM: 'Past exam',
  EXERCISES: 'Exercises',
}

export const NOTE_TYPE_SHORT_LABELS: Record<AdminNoteType, string> = {
  LECTURE_NOTES: 'Lecture',
  SUMMARY: 'Summary',
  REVISION: 'Revision',
  PAST_EXAM: 'Past exam',
  EXERCISES: 'Exercises',
}

export const REVIEW_FILTERS: Array<{ value: AdminNoteStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All notes' },
  { value: 'PENDING_REVIEW', label: 'Pending' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'ARCHIVED', label: 'Archived' },
]

export function formatPrice(price: number): string {
  if (!price) return 'Free'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value))
}
