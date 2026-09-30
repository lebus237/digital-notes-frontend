import { callAction, callActionWithId } from '@digitalnotes/core'

export const listEmployees = callAction('/api/v1/admin/employees', 'GET')
export const getEmployee = callActionWithId('/api/v1/admin/employees/{id}', 'GET')
export const createEmployee = callAction('/api/v1/admin/employees', 'POST')
