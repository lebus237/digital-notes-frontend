import { callAction } from '@digitalnotes/core'

export const login = callAction('/api/login', 'POST')
export const register = callAction('/api/register', 'POST')
export const profile = callAction('/api/me', 'GET')
