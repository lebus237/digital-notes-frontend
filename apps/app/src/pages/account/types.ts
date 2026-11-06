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

export type AcademicForm = {
  universityId: string | null
  facultyId: string | null
  departmentId: string | null
  levelId: string | null
  semesterId: string | null
}

export function academicLabel(profile: StudentProfile | undefined | null): string {
  if (!profile) return 'Programme not set'
  const parts = [profile.departmentName, profile.levelName, profile.semesterName].filter(Boolean)
  if (parts.length === 0) return 'Programme not set'
  return parts.join(' · ')
}
