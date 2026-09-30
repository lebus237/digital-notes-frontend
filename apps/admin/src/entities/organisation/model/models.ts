export type University = {
  id: string
  name: string
  slug: string
}

export type Faculty = {
  id: string
  universityId: string
  name: string
  slug: string
}

export type Department = {
  id: string
  facultyId: string
  name: string
  slug: string
}

export type Level = {
  id: string
  departmentId: string
  name: string
}

export type Semester = {
  id: string
  name: string
}

export type ListQuery = {
  search?: string
  page?: number
  limit?: number
  universityId?: string
  facultyId?: string
  departmentId?: string
}
