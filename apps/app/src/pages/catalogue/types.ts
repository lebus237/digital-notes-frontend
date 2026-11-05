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
  coverUrl?: string | null
}

export type PublicNote = CourseNote & {
  description: string | null
  status: string
  uploadedBy: string
  contributorName: string | null
  publishedAt: string | null
  courseId: string
  courseCode: string
  courseName: string
  departmentId: string | null
  departmentName: string | null
  facultyId: string | null
  facultyName: string | null
  universityId: string | null
  universityName: string | null
  createdAt: string
}

export type NoteDetail = {
  id: string
  courseId: string
  courseCode: string
  courseName: string
  courseDepartmentId: string | null
  courseDepartmentName: string | null
  courseLevelName: string | null
  courseSemesterName: string | null
  title: string
  description: string | null
  noteType: string
  price: number
  status: string
  uploadedBy: string
  contributorName: string | null
  pages: NotePage[]
  providedAt: string | null
  publishedAt: string | null
  updatedAt: string
}

export type NoteTypeMeta = {
  value: string
  label: string
  shortLabel: string
  description: string
  icon: string
}

export const NOTE_TYPES: NoteTypeMeta[] = [
  {
    value: 'LECTURE_NOTES',
    label: 'Lecture notes',
    shortLabel: 'Lecture',
    description: 'Complete course notes, written for the exam season.',
    icon: 'notebook',
  },
  {
    value: 'SUMMARY',
    label: 'Summaries',
    shortLabel: 'Summary',
    description: 'The essentials of a course, condensed into a clear read.',
    icon: 'sparkles',
  },
  {
    value: 'REVISION',
    label: 'Revision sheets',
    shortLabel: 'Revision',
    description: 'Structured sheets to revise faster and retain more.',
    icon: 'book',
  },
  {
    value: 'PAST_EXAM',
    label: 'Past exams',
    shortLabel: 'Past exam',
    description: 'Practice with real subjects and worked corrections.',
    icon: 'file',
  },
  {
    value: 'EXERCISES',
    label: 'Exercises',
    shortLabel: 'Exercises',
    description: 'Guided practice, from warm-up to exam level.',
    icon: 'pencil',
  },
]

export const NOTE_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  NOTE_TYPES.map((type) => [type.value, type.label])
)

export const NOTE_TYPE_SHORT_LABELS: Record<string, string> = Object.fromEntries(
  NOTE_TYPES.map((type) => [type.value, type.shortLabel])
)

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
