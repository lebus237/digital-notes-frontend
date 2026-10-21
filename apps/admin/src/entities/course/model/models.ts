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

export type CourseListItem = {
  id: string
  departmentName: string
  levelName: string
  semesterName: string
  code: string
  name: string
  lecturerName: string | null
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export type CourseFilters = {
  search?: string
  page?: number
  limit?: number
  departmentId?: string
  levelId?: string
  semesterId?: string
}
