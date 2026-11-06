import { callAction, callActionWithId } from '@digitalnotes/core'

export const getStudentProfile = callAction('/api/v1/student/profile', 'GET')
export const updateStudentProfile = callAction('/api/v1/student/profile', 'PATCH')

export const listFavoriteIds = callAction('/api/v1/student/favorites/ids', 'GET')
export const listFavorites = callAction('/api/v1/student/favorites', 'GET')
export const addFavorite = callActionWithId('/api/v1/student/favorites/{noteId}', 'POST')
export const removeFavorite = callActionWithId('/api/v1/student/favorites/{noteId}', 'DELETE')

export const listHistory = callAction('/api/v1/student/history', 'GET')
export const recordNoteView = callActionWithId('/api/v1/student/history/{noteId}', 'POST')

export const listPublicNotes = callAction('/api/v1/notes', 'GET')
export const getNote = callActionWithId('/api/v1/notes/{id}', 'GET')
export const listCourseNotes = callActionWithId('/api/v1/courses/{courseId}/notes', 'GET')
export const listUniversities = callAction('/api/v1/universities', 'GET')
export const listFaculties = callAction('/api/v1/faculties', 'GET')
export const listDepartments = callAction('/api/v1/departments', 'GET')
export const listLevels = callAction('/api/v1/levels', 'GET')
export const listSemesters = callAction('/api/v1/semesters', 'GET')
