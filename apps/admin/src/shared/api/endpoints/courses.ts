import { callAction, callActionWithId } from '@digitalnotes/core'

export const listCourses = callAction('/api/v1/courses', 'GET')
export const getCourse = callActionWithId('/api/v1/courses/{id}', 'GET')

export const createCourse = callAction('/api/v1/admin/courses', 'POST')
export const updateCourse = callActionWithId('/api/v1/admin/courses/{id}', 'PATCH')
export const archiveCourse = callActionWithId('/api/v1/admin/courses/{id}/archive', 'POST')
