export type EmployeeRole = 'administrator' | 'staff' | 'reviewer' | string

export type Employee = {
  id: string
  universityId: string
  fullName: string
  email: string
  phoneNumber: string
  role: EmployeeRole
}

export type EmployeeFilters = {
  search?: string
  page?: number
  limit?: number
  universityId?: string
}
