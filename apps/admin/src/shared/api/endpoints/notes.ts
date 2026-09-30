import { callAction, callActionWithId } from '@digitalnotes/core'

export const listCourseNotes = callActionWithId('/api/v1/courses/{courseId}/notes', 'GET')
export const getNote = callActionWithId('/api/v1/notes/{id}', 'GET')

export const updateNoteMetadata = callActionWithId('/api/v1/admin/notes/{id}', 'PATCH')
export const publishNote = callActionWithId('/api/v1/admin/notes/{id}/publish', 'POST')
export const rejectNote = callActionWithId('/api/v1/admin/notes/{id}/reject', 'POST')
export const archiveNote = callActionWithId('/api/v1/admin/notes/{id}/archive', 'POST')
