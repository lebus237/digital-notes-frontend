import { Image, Stack, Text, Table, Checkbox, ScrollArea, Box, Skeleton } from '@mantine/core'
// @ts-ignore
import classes from './AppTable.module.scss'
import { SafeI18nLabel, useSafeTranslate } from '#/lib/helpers/i18n-safe'
import React, { useState, useMemo, useCallback, memo } from 'react'
import type { Pagination } from '#/types/collection'

export { ActionHelper } from './helpers/ActionHelper'

type BgVariant = 'transparent' | 'white' | 'gray'
type Spacing = 'none' | 'sm' | 'md' | 'lg'

export interface TableColumn {
  accessor: any
  title?: any
  render?: (record: any, index: number) => any
  width?: number | string
  textAlign?: 'left' | 'center' | 'right' | any
  sortable?: boolean
  hidden?: boolean
}

const BG_MAP: Record<BgVariant, string> = {
  transparent: 'transparent',
  white: 'white',
  gray: 'var(--mantine-color-gray-0)',
}

const JUSTIFY_MAP = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
} as const

const getValue = (record: any, accessor: string) => {
  if (typeof accessor === 'string' && accessor.includes('.')) {
    return accessor.split('.').reduce((obj, key) => obj?.[key], record)
  }
  return record?.[accessor]
}

type RowProps<T> = {
  record: T
  index: number
  columns: TableColumn[]
  rowId: string | number
  selected: boolean
  selectable: boolean
  onToggle: (id: string | number) => void
  onRowClick?: (record: T, index: number) => void
}

function AppTableRowInner<T extends Record<string, any>>({
  record,
  index,
  columns,
  rowId,
  selected,
  selectable,
  onToggle,
  onRowClick,
}: RowProps<T>) {
  const handleClick = onRowClick ? () => onRowClick(record, index) : undefined
  const handleToggle = useCallback(() => onToggle(rowId), [onToggle, rowId])

  return (
    <Table.Tr
      bg={selected ? 'var(--mantine-color-blue-light)' : undefined}
      style={{ cursor: onRowClick ? 'pointer' : undefined }}
      onClick={handleClick}
    >
      {selectable && (
        <Table.Td onClick={stopPropagation}>
          <Checkbox checked={selected} onChange={handleToggle} />
        </Table.Td>
      )}
      {columns.map((column, colIdx) => {
        const align = column.textAlign || 'left'
        return (
          <Table.Td
            key={colIdx}
            w={column.width}
            ta={align}
            style={{
              textAlign: align,
              verticalAlign: 'middle',
              paddingInline: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  JUSTIFY_MAP[align as keyof typeof JUSTIFY_MAP] ?? 'flex-start',
                alignItems: 'center',
              }}
            >
              {column.render
                ? column.render(record, index)
                : getValue(record, column.accessor)}
            </div>
          </Table.Td>
        )
      })}
    </Table.Tr>
  )
}

const stopPropagation = (e: React.MouseEvent) => e.stopPropagation()

const AppTableRow = memo(AppTableRowInner) as typeof AppTableRowInner

const SkeletonRow = memo(function SkeletonRow({
  columns,
  withSelection,
  seed,
}: {
  columns: TableColumn[]
  withSelection: boolean
  seed: number
}) {
  return (
    <Table.Tr>
      {withSelection && (
        <Table.Td>
          <Skeleton height={18} width={18} radius="sm" />
        </Table.Td>
      )}
      {columns.map((column, colIdx) => (
        <Table.Td
          key={colIdx}
          w={column.width}
          style={{ paddingInline: 16, verticalAlign: 'middle' }}
        >
          <Skeleton
            height={14}
            width={`${60 + ((seed * 7 + colIdx * 11) % 35)}%`}
            radius="sm"
          />
        </Table.Td>
      ))}
    </Table.Tr>
  )
})

const EmptyState = memo(function EmptyState({
  colSpan,
  minHeight,
  custom,
}: {
  colSpan: number
  minHeight?: string | number
  custom?: React.ReactNode
}) {
  const { trans } = useSafeTranslate()

  return (
    <Table.Tr>
      <Table.Td colSpan={colSpan}>
        {custom ?? (
          <Stack align="center" gap="xs" p="xs" h={minHeight ?? '50vh'}>
            <Box h="30%" mt="5%">
              <Image
                width="100%"
                height="100%"
                src="/empty.svg"
                alt={trans('text.no.data.found')}
              />
            </Box>
            <Text c="dimmed" size="sm" mt="sm">
              <SafeI18nLabel label="text.no.data.found" />
            </Text>
          </Stack>
        )}
      </Table.Td>
    </Table.Tr>
  )
})

type AppTableProps<T extends Record<string, any>> = {
  records: T[]
  columns: TableColumn[]
  pagination?: Pagination
  onPageChange?: (page: number, limit: number) => void
  onRowClick?: (data: T, index: number) => void
  withPagination?: boolean
  withSelection?: boolean
  onSelectionChange?: (selectedRecords: T[]) => void
  emptyState?: React.ReactNode
  bg?: BgVariant
  padding?: Spacing
  margin?: Spacing
  height?: string | number
  minHeight?: string | number
  loading?: boolean
  skeletonRows?: number
  getRowId?: (record: T, index: number) => string | number
}

function AppTable<T extends Record<string, any>>({
  records,
  columns,
  withSelection = false,
  onSelectionChange,
  loading = false,
  skeletonRows = 8,
  getRowId,
  onRowClick,
  emptyState,
  bg = 'transparent',
  height,
  minHeight,
}: AppTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(() => new Set())

  const resolveId = useCallback(
    (record: T, index: number): string | number =>
      getRowId ? getRowId(record, index) : (record.id ?? record._id ?? index),
    [getRowId],
  )

  const visibleColumns = useMemo(() => columns.filter((c) => !c.hidden), [columns])

  const recordsById = useMemo(() => {
    const map = new Map<string | number, T>()
    records.forEach((r, i) => map.set(resolveId(r, i), r))
    return map
  }, [records, resolveId])

  const emitSelection = useCallback(
    (ids: Set<string | number>) => {
      if (!onSelectionChange) return
      const selected: T[] = []
      ids.forEach((id) => {
        const r = recordsById.get(id)
        if (r) selected.push(r)
      })
      onSelectionChange(selected)
    },
    [onSelectionChange, recordsById],
  )

  const toggleRow = useCallback(
    (id: string | number) => {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        emitSelection(next)
        return next
      })
    },
    [emitSelection],
  )

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      const allIds = records.map((r, i) => resolveId(r, i))
      const next = prev.size === records.length ? new Set<string | number>() : new Set(allIds)
      emitSelection(next)
      return next
    })
  }, [records, resolveId, emitSelection])

  const allSelected = selectedIds.size > 0 && selectedIds.size === records.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < records.length

  const tableStyle = useMemo(() => ({ backgroundColor: BG_MAP[bg] }), [bg])
  const rootStyle = useMemo(() => ({ height }), [height])

  const minTableWidth = useMemo(
    () =>
      visibleColumns.reduce(
        (total, column) => total + (typeof column.width === 'number' ? column.width : 150),
        withSelection ? 48 : 0,
      ),
    [visibleColumns, withSelection],
  )

  const colSpan = visibleColumns.length + (withSelection ? 1 : 0)

  const body = useMemo(() => {
    if (loading) {
      return Array.from({ length: skeletonRows }).map((_, i) => (
        <SkeletonRow
          key={`sk-${i}`}
          columns={visibleColumns}
          withSelection={withSelection}
          seed={i}
        />
      ))
    }
    if (records.length === 0) {
      return <EmptyState colSpan={colSpan} minHeight={minHeight} custom={emptyState} />
    }
    return records.map((record, index) => {
      const id = resolveId(record, index)
      return (
        <AppTableRow
          key={id}
          record={record}
          index={index}
          columns={visibleColumns}
          rowId={id}
          selected={selectedIds.has(id)}
          selectable={withSelection}
          onToggle={toggleRow}
          onRowClick={onRowClick}
        />
      )
    })
  }, [
    loading,
    skeletonRows,
    records,
    visibleColumns,
    withSelection,
    colSpan,
    minHeight,
    emptyState,
    resolveId,
    selectedIds,
    toggleRow,
    onRowClick,
  ])

  const tableContent = (
    <Table.ScrollContainer minWidth={minTableWidth} className={classes.scrollArea}>
      <Table className={classes.table} style={tableStyle}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            {withSelection && (
              <Table.Th w={40}>
                <Checkbox
                  onChange={toggleAll}
                  checked={allSelected}
                  indeterminate={someSelected}
                  disabled={loading || records.length === 0}
                />
              </Table.Th>
            )}
            {visibleColumns.map((column, index) => (
              <Table.Th
                key={index}
                w={column.width}
                style={{ textAlign: column.textAlign ?? 'left' }}
              >
                <Text size="sm" fw={500}>
                  {column.title || String(column.accessor)}
                </Text>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{body}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )

  return (
    <div className={classes.root} style={rootStyle}>
      {height ? <ScrollArea h={height}>{tableContent}</ScrollArea> : tableContent}
    </div>
  )
}

export default memo(AppTable) as typeof AppTable
