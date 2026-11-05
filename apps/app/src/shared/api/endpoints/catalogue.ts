import { callAction, callActionWithId } from '@digitalnotes/core'

export const listUniversities = callAction('/api/v1/universities', 'GET')
export const getUniversity = callActionWithId('/api/v1/universities/{id}', 'GET')

export const listFaculties = callAction('/api/v1/faculties', 'GET')
export const getFaculty = callActionWithId('/api/v1/faculties/{id}', 'GET')

export const listDepartments = callAction('/api/v1/departments', 'GET')
export const getDepartment = callActionWithId('/api/v1/departments/{id}', 'GET')

export const listLevels = callAction('/api/v1/levels', 'GET')
export const listSemesters = callAction('/api/v1/semesters', 'GET')

export const listCourses = callAction('/api/v1/courses', 'GET')
export const getCourse = callActionWithId('/api/v1/courses/{id}', 'GET')

export const listCourseNotes = callActionWithId('/api/v1/courses/{courseId}/notes', 'GET')
export const getNote = callActionWithId('/api/v1/notes/{id}', 'GET')
