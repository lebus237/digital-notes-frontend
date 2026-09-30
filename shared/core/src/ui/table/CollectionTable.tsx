import CollectionDisplayTable from './CollectionDisplayTable'
import { useCollectionService } from '#/hooks'
import React from 'react'
import type { TableColumn } from './AppTable'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { AnalyticsItemType, ToolSizes } from '#/ui/collection/CollectionDisplay'

function CollectionTable({
  ...props
}: {
  columns: TableColumn[]
  fetchApi: (query: any) => Promise<any>
  cacheKey?: string
  height?: string
  customQuery?: any
  refetching?: any
  onRowClick?: (data: any) => void
  analytics?: AnalyticsItemType[]
  toolSizes?: ToolSizes
  children?: React.ReactNode
  marginBottom?: string
  limit?: number
  hidden?: boolean
  queryClientOptions?: Partial<UseQueryOptions<any, any, any>>
  collectionExportName?: string
  hidePlugins?: {
    search?: boolean
    pagination?: boolean
    filters?: boolean
    order?: boolean
    range?: boolean
    export?: boolean
  }
}) {
  const controller = useCollectionService(
    props.fetchApi,
    {
      pagination: { page: 1, limit: props.limit ?? 20 },
    },
    props.cacheKey,
    props.customQuery,
    props.refetching,
    props.queryClientOptions,
  )

  return (
    <CollectionDisplayTable
      {...props}
      toolbarExtra={props.children}
      records={controller.data}
      controller={controller}
      hidePlugins={props.hidePlugins}
    />
  )
}

export default CollectionTable
