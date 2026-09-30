export type Course = {
  id: string
  departmentId: string
  levelId: string
  semesterId: string
  code: string
  name: string
  description?: string | null
  lecturerName?: string | null
}

export type CourseFilters = {
  search?: string
  page?: number
  limit?: number
  departmentId?: string
  levelId?: string
  semesterId?: string
}
