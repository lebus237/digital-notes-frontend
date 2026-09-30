import { callAction, callActionWithId } from '@digitalnotes/core'

// Public read endpoints (backend start/routes.ts — /api/v1, publicReadThrottle)
export const listUniversities = callAction('/api/v1/universities', 'GET')
export const listFaculties = callAction('/api/v1/faculties', 'GET')
export const listDepartments = callAction('/api/v1/departments', 'GET')
export const listLevels = callAction('/api/v1/levels', 'GET')
export const listSemesters = callAction('/api/v1/semesters', 'GET')

// Admin write endpoints (backend — /api/v1/admin, administrator role)
export const createUniversity = callAction('/api/v1/admin/universities', 'POST')
export const createFaculty = callAction('/api/v1/admin/faculties', 'POST')
export const createDepartment = callAction('/api/v1/admin/departments', 'POST')
export const createLevel = callAction('/api/v1/admin/levels', 'POST')
export const createSemester = callAction('/api/v1/admin/semesters', 'POST')

export const getFaculty = callActionWithId('/api/v1/faculties/{id}', 'GET')
export const getDepartment = callActionWithId('/api/v1/departments/{id}', 'GET')
