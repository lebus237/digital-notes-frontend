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

export type NotePage = {
  id: string
  uploadId: string
  url: string | null
  mimeType: string | null
  size: number | null
  sortOrder: number
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

export type StudentProfile = {
  id: string
  fullName: string | null
  email: string
  phoneNumber: string
  role: string
  createdAt: string
  universityId: string | null
  universityName: string | null
  facultyId: string | null
  facultyName: string | null
  departmentId: string | null
  departmentName: string | null
  levelId: string | null
  levelName: string | null
  semesterId: string | null
  semesterName: string | null
}

export const NOTE_TYPE_LABELS: Record<string, string> = {
  LECTURE_NOTES: 'Lecture notes',
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

export function academicLabel(profile: StudentProfile | undefined | null): string {
  if (!profile) return 'Programme not set'
  const parts = [profile.departmentName, profile.levelName, profile.semesterName].filter(Boolean)
  return parts.length === 0 ? 'Programme not set' : parts.join(' · ')
}
