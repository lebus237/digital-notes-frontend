import type { DocumentExtension } from './DocumentFile'

export interface Pagination {
  page: number
  limit: number
  total?: number | undefined
}

export interface CollectionQueryType {
  pagination: Pagination
  query?: string
  order?: string
  filter?: string
  dateRange?: { fromDate?: string; toDate?: string }
  exports?: Array<{ type: DocumentExtension; url: string }>
}

export interface CollectionMeta {
  pagination: Pagination & { total: number }
  order?: string[] | string | undefined
  filter?: string[] | string | undefined
  dateRange?: { fromDate?: string; toDate?: string } | undefined
  exports?: Array<{ type: DocumentExtension; url: string }> | undefined
  [key: string]: unknown
}

export type CollectionResponseType<T> = {
  data: T[]
  meta: CollectionMeta | Record<string, any>
  analytics?: any
}

export class CollectionResponse<T> {
  constructor(
    public data: T[],
    public meta: any,
    public analytics: any,
  ) {}
}

export const DEFAULT_COLLECTION_LIMIT = 20

export function normalizePagination(meta: any, fallbackLimit = DEFAULT_COLLECTION_LIMIT): Pagination & { total: number } {
  if (!meta || typeof meta !== 'object') {
    return { page: 1, limit: fallbackLimit, total: 0 }
  }
  if (meta.pagination && typeof meta.pagination === 'object') {
    const raw = meta.pagination as Record<string, any>
    const page = Number(raw.page ?? raw.offset ?? 1) || 1
    const limit = Number(raw.limit ?? raw.per_page ?? raw.perPage ?? fallbackLimit) || fallbackLimit
    const total = Number(raw.total ?? 0) || 0
    return { page, limit, total }
  }
  const page = Number(meta.current_page ?? meta.currentPage ?? meta.page ?? meta.offset ?? 1) || 1
  const limit = Number(meta.per_page ?? meta.perPage ?? meta.limit ?? fallbackLimit) || fallbackLimit
  const total = Number(meta.total ?? 0) || 0
  return { page, limit, total }
}

export function normalizeCollectionMeta(meta: any, fallbackLimit = DEFAULT_COLLECTION_LIMIT): CollectionMeta {
  const pagination = normalizePagination(meta, fallbackLimit)
  if (!meta || typeof meta !== 'object') {
    return { pagination }
  }
  return {
    ...meta,
    pagination,
  } as CollectionMeta
}

export function normalizeCollectionResponse<T>(payload: unknown, fallbackLimit = DEFAULT_COLLECTION_LIMIT): CollectionResponseType<T> {
  if (Array.isArray(payload)) {
    return {
      data: payload as T[],
      meta: { pagination: { page: 1, limit: payload.length || fallbackLimit, total: payload.length } },
    }
  }
  if (payload !== null && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    const rawData = Array.isArray(record.data)
      ? (record.data as T[])
      : Array.isArray((record.data as Record<string, unknown> | null)?.data)
        ? ((record.data as Record<string, unknown>).data as T[])
        : []
    const rawMeta = (record.meta as Record<string, unknown> | undefined) ?? {}
    return {
      data: rawData,
      meta: normalizeCollectionMeta(rawMeta, fallbackLimit),
      analytics: (record.analytics as any) ?? undefined,
    }
  }
  return {
    data: [],
    meta: { pagination: { page: 1, limit: fallbackLimit, total: 0 } },
  }
}

export function toCollectionQueryParams(query: CollectionQueryType, customQuery?: Record<string, any>): Record<string, any> {
  return {
    'page[offset]': query?.pagination?.page,
    'page[limit]': query?.pagination?.limit,
    'page': query?.pagination?.page,
    'limit': query?.pagination?.limit,
    'q': query.query,
    'search': query.query,
    'order': query.order,
    'sort': query.order,
    'filter': query.filter,
    'fromDate': query.dateRange?.fromDate,
    'toDate': query.dateRange?.toDate,
    ...customQuery,
  }
}
