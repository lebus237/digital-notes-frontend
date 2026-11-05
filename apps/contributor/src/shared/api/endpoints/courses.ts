import { callAction } from '@digitalnotes/core'

export const listCourses = callAction('/api/v1/courses', 'GET')
