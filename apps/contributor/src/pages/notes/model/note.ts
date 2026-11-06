import type { NoteStatus, NoteType } from '@/entities/note'

export type ContributorNote = {
  id: string
  title: string
  courseCode: string
  courseName: string
  noteType: NoteType
  price: number
  status: NoteStatus
  pageCount: number
  providedAt: string | null
  updatedAt: string
}

export type ContributorCourse = {
  id: string
  code: string
  name: string
}

export const NOTE_STATUS_COLORS: Record<NoteStatus, string> = {
  DRAFT: 'gray',
  PENDING_REVIEW: 'yellow',
  PUBLISHED: 'green',
  REJECTED: 'red',
  ARCHIVED: 'dark',
}

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
