import {
  authSuccess,
  callAction,
  endSession,
  LocalStorage,
} from '@digitalnotes/core'

export const AUTH_CHANGED_EVENT = 'digitalnotes:auth-changed'

export type SessionUser = {
  id?: string
  fullName?: string | null
  email?: string
  phoneNumber?: string
  role?: string
  emailVerified?: boolean
  createdAt?: string
}

export type LoginPayload = { email: string; password: string }
export type RegisterPayload = {
  fullName: string
  email: string
  phoneNumber: string
  password: string
}
export type ForgotPasswordPayload = { email?: string; phoneNumber?: string }
export type ResetPasswordPayload = { token: string; password: string }
export type ChangePasswordPayload = { currentPassword: string; newPassword: string }

type AuthResponse = {
  data?: {
    user?: SessionUser
    accessToken?: string
    refreshToken?: string
    context?: unknown
  }
  error?: { message?: string; code?: string }
  message?: string
  errors?: Array<{ message?: string } | string>
}

export function notifyAuthChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
  }
}

export function getSessionUser(): SessionUser | null {
  return LocalStorage.getUser<SessionUser>()
}

export function hasSession(): boolean {
  return Boolean(LocalStorage.getAuthToken())
}

function errorMessage(response: AuthResponse | null): string {
  if (!response) return 'Cannot reach the server. Check your connection and try again.'
  if (response.error?.message) return response.error.message
  if (response.message) return response.message
  const first = response.errors?.[0]
  if (typeof first === 'string') return first
  if (first?.message) return first.message
  return 'The request could not be completed. Please try again.'
}

function persistAuthResponse(response: AuthResponse | null) {
  const data = response?.data
  if (!data?.accessToken) {
    throw new Error(errorMessage(response))
  }
  authSuccess(data)
  notifyAuthChanged()
  return data
}

export async function loginStudent(payload: LoginPayload) {
  const response = (await callAction('/api/login', 'POST')(payload)) as AuthResponse | null
  return persistAuthResponse(response)
}

export async function registerStudent(payload: RegisterPayload) {
  const response = (await callAction('/api/register', 'POST')(payload)) as AuthResponse | null
  return persistAuthResponse(response)
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  return callAction('/api/forgot-password', 'POST')(payload)
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await callAction('/api/reset-password', 'POST')(payload)
  if (response?.error) throw new Error(errorMessage(response as AuthResponse))
  if (response?.message && !response?.data) throw new Error(response.message)
  return response
}

export async function changePassword(payload: ChangePasswordPayload) {
  const response = await callAction('/api/change-password', 'POST')(payload)
  if (response?.error || response?.message) {
    throw new Error(errorMessage(response as AuthResponse))
  }
  return response
}

export async function verifyEmail(token: string) {
  const response = await callAction('/api/email/verify', 'POST')({ token })
  if (response?.error || (response?.message && !response?.data)) {
    throw new Error(errorMessage(response as AuthResponse))
  }
  return response
}

export async function resendVerification() {
  const response = await callAction('/api/email/resend', 'POST')()
  if (response?.error || (response?.message && !response?.data)) {
    throw new Error(errorMessage(response as AuthResponse))
  }
  return response
}

export async function refreshCurrentUser(): Promise<SessionUser | null> {
  const response = await callAction('/api/me', 'GET')()
  const user = response?.data?.user as SessionUser | undefined
  if (!user) return null
  LocalStorage.setUser(user)
  notifyAuthChanged()
  return user
}

export async function logoutStudent() {
  await endSession()
  notifyAuthChanged()
}
