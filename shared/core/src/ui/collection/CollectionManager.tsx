import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import CollectionDisplayTable from '#/ui/table/CollectionDisplayTable'
import CollectionTable from '#/ui/table/CollectionTable'
import type { TableColumn } from '#/ui/table/AppTable'
import type { CollectionServiceReturnType } from '#/hooks/use-collection-service'

export type LegacyCollectionColumn<T> = {
  key: string
  title: string
  align?: 'left' | 'right' | 'center'
  render: (row: T) => ReactNode
}

export type CollectionColumn<T> = LegacyCollectionColumn<T> | (TableColumn & { key?: string })

type BaseManagerProps<T> = {
  columns: Array<CollectionColumn<T>>
  searchPlaceholder?: string
  filter?: ReactNode
  summary?: string
  emptyLabel?: string
  limit?: number
  hideSearch?: boolean
}

type ClientManagerProps<T extends { id: string }> = BaseManagerProps<T> & {
  rows: T[]
  search: string
  onSearchChange: (value: string) => void
}

type ServerManagerProps<T> = BaseManagerProps<T> & {
  fetchApi: (query: any) => Promise<any>
  cacheKey?: string
  customQuery?: any
  refetching?: any
  onRowClick?: (data: any) => void
  children?: ReactNode
}

function toTableColumns<T>(columns: Array<CollectionColumn<T>>): TableColumn[] {
  return columns.map((col: any) => {
    if ('accessor' in col && col.accessor) {
      return col as TableColumn
    }
    return {
      accessor: col.key,
      title: col.title,
      textAlign: col.align ?? 'left',
      render: col.render ? (record: any, index: number) => col.render(record, index) : undefined,
    } as TableColumn
  })
}

function useClientController<T>(rows: T[], search: string, onSearchChange: (v: string) => void, limit: number) {
  const [page, setPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(limit)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row: any) =>
      Object.values(row ?? {}).some((v) => String(v ?? '').toLowerCase().includes(q)),
    )
  }, [rows, search])

  const paged = useMemo(() => {
    const start = (page - 1) * pageLimit
    return filtered.slice(start, start + pageLimit)
  }, [filtered, page, pageLimit])

  const controller = useMemo(
    () =>
      ({
        data: paged,
        isLoading: false,
        query: { pagination: { page, limit: pageLimit }, query: search },
        meta: { pagination: { page, limit: pageLimit, total: filtered.length } },
        analytics: undefined,
        onPaginate: (nextPage: number, nextLimit: number) => {
          setPage(nextPage)
          setPageLimit(nextLimit)
        },
        onSearch: (value: string) => {
          setPage(1)
          onSearchChange(value)
        },
        onChangeQuery: (value: string) => {
          setPage(1)
          onSearchChange(value)
        },
        onChangeFilter: () => {},
        onChangeOrder: () => {},
        onDateChange: () => {},
        refetch: () => {},
      }) as unknown as CollectionServiceReturnType,
    [paged, page, pageLimit, search, filtered.length, onSearchChange],
  )

  return { controller, paged, total: filtered.length }
}

export function CollectionManager<T extends { id: string }>(props: ClientManagerProps<T> | ServerManagerProps<T>) {
  const tableColumns = useMemo(() => toTableColumns((props as any).columns ?? []), [(props as any).columns])

  if ('fetchApi' in props) {
    const server = props as ServerManagerProps<T>
    return (
      <CollectionTable
        columns={tableColumns}
        fetchApi={server.fetchApi}
        cacheKey={server.cacheKey}
        customQuery={server.customQuery}
        refetching={server.refetching}
        onRowClick={server.onRowClick}
        limit={server.limit ?? 20}
        hidePlugins={server.hideSearch ? { search: true } : undefined}
      >
        {server.filter ?? server.children}
      </CollectionTable>
    )
  }

  const client = props as ClientManagerProps<T>
  const limit = client.limit ?? 10
  const { controller } = useClientController(client.rows ?? [], client.search ?? '', client.onSearchChange, limit)

  return (
    <CollectionDisplayTable
      records={(controller as any).data}
      columns={tableColumns}
      controller={controller}
      toolbarExtra={client.filter}
      hidePlugins={{ order: true, range: true, export: true, filters: true }}
      toolSizes={{ searchSize: 4, container: 8, size: 3, customFilter: 4 }}
    />
  )
}

export default CollectionManager
