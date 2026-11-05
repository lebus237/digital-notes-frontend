export type University = {
  id: string
  name: string
  slug?: string
}

export type Faculty = {
  id: string
  universityId?: string
  name: string
  slug?: string
}

export type Department = {
  id: string
  facultyId?: string
  facultyName?: string
  name: string
  slug?: string
}

export type Level = {
  id: string
  departmentId: string
  name: string
  year: number
}

export type Semester = {
  id: string
  departmentId: string
  name: string
}

export type Course = {
  id: string
  departmentId?: string
  levelId?: string
  semesterId?: string
  departmentName?: string
  levelName?: string
  semesterName?: string
  code: string
  name: string
  description?: string | null
  lecturerName?: string | null
}

export type NotePage = {
  id: string
  uploadId: string
  url: string | null
  mimeType: string | null
  size: number | null
  sortOrder: number
}

export type CourseNote = {
  id: string
  title: string
  noteType: string
  price: number
  pageCount: number
  providedAt: string | null
  updatedAt: string
}

export type NoteDetail = {
  id: string
  courseId: string
  courseCode: string
  courseName: string
  title: string
  description: string | null
  noteType: string
  price: number
  status: string
  pages: NotePage[]
  providedAt: string | null
  updatedAt: string
}

export const NOTE_TYPE_LABELS: Record<string, string> = {
  LECTURE_NOTES: 'Lecture notes',
  SUMMARY: 'Summary',
  REVISION: 'Revision',
  PAST_EXAM: 'Past exam',
  EXERCISES: 'Exercises',
}

export const NOTE_TYPE_SHORT_LABELS: Record<string, string> = {
  LECTURE_NOTES: 'Lecture',
  SUMMARY: 'Summary',
  REVISION: 'Revision',
  PAST_EXAM: 'Past exam',
  EXERCISES: 'Exercises',
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

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}
