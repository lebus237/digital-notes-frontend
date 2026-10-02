import { LocalStorage, refreshAuthHeader } from '@digitalnotes/core'

export type LoginPayload = {
  email?: string
  phoneNumber?: string
  password: string
}

export type LoginUser = {
  fullName?: string
  email?: string
  phoneNumber?: string
  createdAt?: string
}

export type LoginResponse = {
  user: LoginUser
  context: unknown
  accessToken: string
  refreshToken?: string
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

function persistSession(data: LoginResponse) {
  if (typeof window === 'undefined') return
  LocalStorage.setAuthToken(data.accessToken)
  if (data.refreshToken) LocalStorage.setRefreshToken(data.refreshToken)
  LocalStorage.setAppContext((data.context as object) ?? {})
  try {
    localStorage.setItem('app-user', JSON.stringify({
      fullName: data.user?.fullName,
      email: data.user?.email,
      phoneNumber: data.user?.phoneNumber,
    }))
  } catch {
    return
  }
  refreshAuthHeader()
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
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
  if (!data?.accessToken) {
    throw new Error('Login failed. Try again.')
  }

  persistSession(data)
  return data
}
