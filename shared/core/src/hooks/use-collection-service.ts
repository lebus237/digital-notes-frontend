import React, { useCallback, useEffect, useMemo } from 'react'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { CollectionQueryType } from '#/types/collection'
import { normalizeCollectionMeta, normalizeCollectionResponse, toCollectionQueryParams } from '#/types/collection'

export type CollectionServiceReturnType = {
  data: any[]
  isLoading: boolean
  query: CollectionQueryType
  meta: CollectionQueryType & { pagination: { page: number; limit: number; total: number } } & Record<string, any>
  analytics: any | string[]
  onPaginate: (offset: number, limit: number) => void
  onDateChange: (fromDate?: string, toDate?: string) => void
  onChangeOrder: (value: string) => void
  onChangeFilter: (value: string) => void
  onChangeQuery: (value: string) => void
  onSearch: (value: string) => void
  refetch: () => void
}

const defaultQuery: CollectionQueryType = {
  pagination: { page: 1, limit: 20 },
}

export const useCollectionService = (
  fetchCollection: (query: any) => Promise<any>,
  queryParams: CollectionQueryType = defaultQuery,
  queryKey: string = (fetchCollection as any).queryKey ||
    fetchCollection.name ||
    'collection/request',
  customQuery?: any,
  refetching?: any,
  queryClientOptions?: Partial<UseQueryOptions<any, any>>,
) => {
  const [collectionQuery, setCollectionQuery] = React.useState<CollectionQueryType>(queryParams)

  const [meta, setMeta] = React.useState<CollectionServiceReturnType['meta']>({
    pagination: { page: 1, limit: queryParams.pagination?.limit ?? 20, total: 0 },
  } as CollectionServiceReturnType['meta'])

  const parsedQuery = useMemo(
    () => toCollectionQueryParams(collectionQuery, customQuery),
    [collectionQuery, customQuery],
  )

  const {
    data: rawResp,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      queryKey,
      customQuery,
      collectionQuery.query ?? 'query',
      collectionQuery.filter ?? 'filter',
      collectionQuery.order ?? 'order',
      collectionQuery.pagination?.page,
      collectionQuery.pagination?.limit,
      collectionQuery.dateRange?.fromDate,
      collectionQuery.dateRange?.toDate,
    ],
    placeholderData: (previousData) => previousData,
    queryFn: () => fetchCollection(parsedQuery),
    staleTime: 0,
    ...queryClientOptions,
  })

  useEffect(() => {
    void refetch()
  }, [refetching, refetch])

  const resp = useMemo(() => normalizeCollectionResponse<any>(rawResp), [rawResp])

  React.useEffect(() => {
    if (rawResp) {
      const normalizedMeta = normalizeCollectionMeta((rawResp as any)?.meta ?? (resp as any)?.meta)
      setMeta(() => ({
        ...(rawResp as any)?.meta,
        ...normalizedMeta,
        pagination: {
          ...normalizedMeta.pagination,
          page: normalizedMeta.pagination.page,
        },
      }) as CollectionServiceReturnType['meta'])
    }
  }, [rawResp, resp])

  const onPaginate = useCallback((offset: number, limit: number) => {
    setCollectionQuery((prevState: any) => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        page: offset,
        limit: limit,
      },
    }))
  }, [])

  const onChangeOrder = useCallback((value: string) => {
    setCollectionQuery((prevState: any) => ({
      ...prevState,
      order: value,
      pagination: { ...prevState.pagination, page: 1 },
    }))
  }, [])

  const onChangeFilter = useCallback((value: string) => {
    setCollectionQuery((prevState: any) => ({
      ...prevState,
      filter: value,
      pagination: { ...prevState.pagination, page: 1 },
    }))
  }, [])

  const onDateChange = useCallback((fromDate?: string, toDate?: string) => {
    setCollectionQuery((prevState: any) => ({
      ...prevState,
      dateRange: { fromDate, toDate },
      pagination: { ...prevState.pagination, page: 1 },
    }))
  }, [])

  const onSearch = useCallback((value: string) => {
    setCollectionQuery((prevState: any) => ({
      ...prevState,
      query: value,
      pagination: { ...prevState.pagination, page: 1 },
    }))
  }, [])

  const onChangeQuery = useCallback((value: string) => {
    setCollectionQuery((prevState: any) => ({
      ...prevState,
      query: value,
      pagination: { ...prevState.pagination, page: 1 },
    }))
  }, [])

  return useMemo(
    (): CollectionServiceReturnType => ({
      query: collectionQuery,
      meta,
      isLoading,
      analytics: resp?.analytics,
      onPaginate,
      onChangeOrder,
      onChangeFilter,
      onSearch,
      onDateChange,
      onChangeQuery,
      refetch: () => {
        void refetch()
      },
      data: resp?.data ?? [],
    }),
    [
      collectionQuery,
      meta,
      isLoading,
      resp?.analytics,
      resp?.data,
      onPaginate,
      onDateChange,
      onChangeOrder,
      onChangeFilter,
      onSearch,
      onChangeQuery,
      refetch,
    ],
  )
}
