import axios from './axios-client'
import LocalStorage from '../local-storage/LocalStorage'
import { getApiEndpoint } from '../../lib/utils/runtime-config'

export const API_V1 = '/api/v1'
export const ADMIN_PREFIX = '/api/v1/admin'

export const apiPaths = {
  universities: `${API_V1}/universities`,
  faculties: `${API_V1}/faculties`,
  departments: `${API_V1}/departments`,
  levels: `${API_V1}/levels`,
  semesters: `${API_V1}/semesters`,
  courses: `${API_V1}/courses`,
  courseDetail: (id: string) => `${API_V1}/courses/${id}`,
  courseNotes: (courseId: string) => `${API_V1}/courses/${courseId}/notes`,
  noteDetail: (id: string) => `${API_V1}/notes/${id}`,
  adminUniversities: `${ADMIN_PREFIX}/universities`,
  adminFaculties: `${ADMIN_PREFIX}/faculties`,
  adminDepartments: `${ADMIN_PREFIX}/departments`,
  adminLevels: `${ADMIN_PREFIX}/levels`,
  adminSemesters: `${ADMIN_PREFIX}/semesters`,
  adminCourses: `${ADMIN_PREFIX}/courses`,
  adminCourseDetail: (id: string) => `${ADMIN_PREFIX}/courses/${id}`,
  adminCourseArchive: (id: string) => `${ADMIN_PREFIX}/courses/${id}/archive`,
  adminEmployees: `${ADMIN_PREFIX}/employees`,
  adminEmployeeDetail: (id: string) => `${ADMIN_PREFIX}/employees/${id}`,
  adminNoteUpdate: (id: string) => `${ADMIN_PREFIX}/notes/${id}`,
  adminNotePublish: (id: string) => `${ADMIN_PREFIX}/notes/${id}/publish`,
  adminNoteReject: (id: string) => `${ADMIN_PREFIX}/notes/${id}/reject`,
  adminNoteArchive: (id: string) => `${ADMIN_PREFIX}/notes/${id}/archive`,
  adminUserResetPassword: (id: string) => `${ADMIN_PREFIX}/users/${id}/reset-password`,
} as const

let configured = false

export function ensureApiConfigured(): void {
  axios.defaults.baseURL = getApiEndpoint()
  const token = LocalStorage.getAuthToken()
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }
  configured = true
}

export function refreshAuthHeader(): void {
  const token = LocalStorage.getAuthToken()
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common.Authorization
  }
}

export type ListParams = {
  search?: string
  page?: number
  limit?: number
  [key: string]: string | number | undefined
}

export function toQuery(params?: ListParams): string {
  if (!params) return ''
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  )
  if (entries.length === 0) return ''
  return `?${entries.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join('&')}`
}

function unwrap<T>(payload: unknown): T {
  if (payload !== null && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    return (payload as { data: T }).data
  }
  return payload as T
}

export async function apiGet<T>(path: string, params?: ListParams): Promise<T> {
  if (!configured) ensureApiConfigured()
  const response = await axios.get(`${path}${toQuery(params)}`)
  return unwrap<T>(response.data)
}

export async function apiPost<TResponse, TBody = unknown>(path: string, body?: TBody): Promise<TResponse> {
  if (!configured) ensureApiConfigured()
  const response = await axios.post(path, body)
  return unwrap<TResponse>(response.data)
}

export async function apiPatch<TResponse, TBody = unknown>(path: string, body?: TBody): Promise<TResponse> {
  if (!configured) ensureApiConfigured()
  const response = await axios.patch(path, body)
  return unwrap<TResponse>(response.data)
}

export async function apiDelete<TResponse = void>(path: string): Promise<TResponse> {
  if (!configured) ensureApiConfigured()
  const response = await axios.delete(path)
  return unwrap<TResponse>(response.data)
}

export function unwrapCollection<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (payload !== null && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    if (Array.isArray(record.data)) return record.data as T[]
    if (record.data !== null && typeof record.data === 'object') {
      const inner = record.data as Record<string, unknown>
      if (Array.isArray(inner.data)) return inner.data as T[]
    }
  }
  return []
}

export function getServerMessage(error: unknown, fallback: string): string {
  if (error !== null && typeof error === 'object') {
    const record = error as Record<string, unknown>
    const response = record.response as { data?: { message?: unknown; errors?: Array<{ message?: unknown } | string> }; status?: number } | undefined
    const body = response?.data
    if (typeof body?.message === 'string' && body.message.trim() !== '') return body.message
    const first = body?.errors?.[0]
    if (typeof first === 'string' && first.trim() !== '') return first
    if (first !== null && typeof first === 'object' && typeof first.message === 'string' && first.message.trim() !== '') {
      return first.message
    }
  }
  if (error instanceof Error && error.message.trim() !== '') return error.message
  return fallback
}
