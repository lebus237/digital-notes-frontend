import { callActionWithId } from '@digitalnotes/core'

export const adminResetPassword = callActionWithId('/api/v1/admin/users/{id}/reset-password', 'POST')
