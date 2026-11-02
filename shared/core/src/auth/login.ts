import type { QueryClient } from '@tanstack/react-query'
import LocalStorage from '#/infra/local-storage/LocalStorage'
import { refreshAuthHeader } from '#/infra/http/api-client'
import type { SessionUser } from './session'

export type LoginPayload = {
  email?: string
  phoneNumber?: string
  password: string
}

export type LoginResponse = {
  user: SessionUser
  context: unknown
  accessToken: string
  refreshToken: string
}

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const runtime = (window as unknown as { __RUNTIME_CONFIG__?: { API_URL?: string; APP_URL?: string } }).__RUNTIME_CONFIG__
    const value = runtime?.API_URL ?? runtime?.APP_URL
    if (value !== undefined && value.trim() !== '') {
      return value.trim() === '/api' || value.trim() === '/api/' ? '' : value.trim().replace(/\/$/, '')
    }
  }

  const buildTime = (import.meta as any).env?.VITE_API_ENDPOINT as string | undefined
  if (buildTime !== undefined && buildTime.trim() !== '') {
    return buildTime.trim() === '/api' || buildTime.trim() === '/api/' ? '' : buildTime.trim().replace(/\/$/, '')
  }

  return ''
}

function getServerMessage(body: any, status: number): string {
  if (typeof body?.message === 'string' && body.message.trim() !== '') return body.message
  const firstError = body?.errors?.[0]
  if (typeof firstError?.message === 'string' && firstError.message.trim() !== '') return firstError.message
  if (typeof firstError === 'string' && firstError.trim() !== '') return firstError
  if (status === 401) return 'Invalid email or password. Check your details and try again.'
  if (status === 429) return 'Too many attempts. Wait a moment and try again.'
  return 'Login failed. Try again.'
}

export function persistSession(data: LoginResponse, queryClient?: QueryClient) {
  if (typeof window === 'undefined') return
  // Drop any cache from a previous account before storing the new session.
  queryClient?.clear()
  queryClient?.setQueryData(['me'], { user: data.user, context: data.context })
  LocalStorage.setAuthToken(data.accessToken)
  if (data.refreshToken) LocalStorage.setRefreshToken(data.refreshToken)
  LocalStorage.setAppContext((data.context as object) ?? {})
  LocalStorage.setUser({
    id: data.user?.id,
    fullName: data.user?.fullName,
    email: data.user?.email,
    phoneNumber: data.user?.phoneNumber,
    role: data.user?.role,
  })
  refreshAuthHeader()
}

/**
 * App login. Pass the app's `QueryClient` so the previous account's cache is
 * dropped and `['me']` is primed — the `_app` shell then renders instantly
 * without waiting on a `/me` round-trip.
 */
export async function login(payload: LoginPayload, queryClient?: QueryClient): Promise<LoginResponse> {
  let response: Response
  try {
    response = await fetch(`${getApiBaseUrl()}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Cannot reach the server. Check your connection and try again.')
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(getServerMessage(body, response.status))
  }

  const data = body?.data as LoginResponse | undefined
  if (!data?.accessToken || !data?.refreshToken) {
    throw new Error('Login failed. Try again.')
  }

  persistSession(data, queryClient)
  return data
}
