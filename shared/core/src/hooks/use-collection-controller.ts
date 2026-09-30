'use client'

import { useEffect, useState } from 'react'
import { normalizeCollectionResponse, toCollectionQueryParams } from '#/types/collection'

type TableParams = {
  offset: number
  limit: number
  total: number
}

export interface CollectionProps {
  meta: {
    pagination: TableParams
    order?: any
    filter?: any
    dateRange?: any
    [key: string]: any
  }
  analytics?: any[]
  data: any[]
}

export const defaultCollection: CollectionProps = {
  meta: {
    pagination: {
      offset: 1,
      limit: 30,
      total: 0,
    },
  },
  data: [],
}

export type QueryType = {
  query?: string
  order?: string
  filter?: string
  dateRange?: { fromDate?: string; toDate?: string }
}

export interface CollectionControllerProps {
  loading: boolean
  canLoadMore: boolean
  collection: CollectionProps
  onOrderTable: (order: string) => void
  onFilterTable: (filter: string) => void
  setCollection: (
    value: ((prevState: CollectionProps) => CollectionProps) | CollectionProps,
  ) => void
  setPagination: (page: number, pageSize: number) => Promise<void>
  onFilterRange: (fromDate: string, toDate: string) => void
  onSearch: (text?: string) => void
  onClear: () => void
  loadMore: () => void
  fetchData: (page?: number, pageSize?: number) => void
  paginationHandler: (page: any, limit: any) => Promise<void>
}

export type TablePagination = {
  offset: number
  limit: number
}

export default function useCollectionController(
  fetchCollection: (props?: any) => Promise<any>,
  customQuery = {},
  pagination?: TablePagination,
  refresh?: any,
) {
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState<QueryType>({})
  const [collection, setCollection] = useState<CollectionProps>(defaultCollection)
  const canLoadMore =
    collection?.meta?.pagination?.total /
      (collection?.meta?.pagination?.limit * collection?.meta?.pagination?.offset) >
    1

  useEffect(() => {
    ;(async () => {
      await fetchData(
        pagination?.offset ?? collection?.meta?.pagination.offset,
        pagination?.limit ?? collection?.meta?.pagination.limit,
      )
    })()
  }, [refresh, query])

  const fetchData = async (page?: number, pageSize?: number) => {
    setLoading(true)

    const params: any = toCollectionQueryParams(
      {
        pagination: {
          page: page ?? pagination?.offset ?? 1,
          limit: pageSize ?? pagination?.limit ?? 30,
        },
        query: query.query,
        filter: query.filter,
        order: query.order,
        dateRange: query.dateRange,
      },
      customQuery,
    )

    const raw = await fetchCollection(params)
    const normalized = normalizeCollectionResponse<any>(raw)

    setLoading(false)
    setCollection({
      data: normalized.data,
      analytics: normalized.analytics,
      meta: {
        ...(typeof raw?.meta === 'object' ? raw.meta : {}),
        pagination: {
          offset: normalized.meta.pagination.page,
          limit: normalized.meta.pagination.limit,
          total: normalized.meta.pagination.total,
        },
        order: (normalized.meta as any).order,
        filter: (normalized.meta as any).filter,
        dateRange: (normalized.meta as any).dateRange,
      },
    })
  }

  const loadMore = async () => {
    setLoading(true)

    const params: any = {
      ...customQuery,
      'page[offset]': (collection.meta?.pagination.offset ?? 1) + 1,
      'page[limit]': collection.meta?.pagination.limit ?? pagination?.limit ?? 30,
      'page': (collection.meta?.pagination.offset ?? 1) + 1,
      'limit': collection.meta?.pagination.limit ?? pagination?.limit ?? 30,
    }

    const raw = await fetchCollection(params)
    const normalized = normalizeCollectionResponse<any>(raw)

    setLoading(false)
    setCollection((prevState) => ({
      ...prevState,
      meta: {
        ...prevState.meta,
        pagination: {
          offset: normalized.meta.pagination.page,
          limit: normalized.meta.pagination.limit,
          total: normalized.meta.pagination.total,
        },
      },
      data: [...prevState.data, ...normalized.data],
    }))
  }

  const paginationHandler = async (page: any, limit?: any) =>
    await fetchData(page, limit ?? collection?.meta?.pagination.limit)
  const onSearch = (text?: string) => setQuery((prev) => ({ ...prev, query: text }))
  const onOrderTable = (order: string) => setQuery((prev) => ({ ...prev, order: order }))
  const onFilterTable = (filter: string) => setQuery((prev) => ({ ...prev, filter: filter }))
  const setPagination = (page: number, pageSize: number) => fetchData(page, pageSize)
  const onFilterRange = (fromDate: string, toDate: string) =>
    setQuery((prev) => ({
      ...prev,
      dateRange: {
        fromDate: fromDate,
        toDate: toDate,
      },
    }))

  const onClear = () => setCollection(defaultCollection)

  // @ts-ignore
  return <CollectionControllerProps>{
    query,
    loading,
    collection,
    onOrderTable,
    onFilterTable,
    setCollection,
    setPagination,
    onFilterRange,
    onSearch,
    onClear,
    fetchData,
    loadMore,
    canLoadMore,
    paginationHandler,
  }
}
