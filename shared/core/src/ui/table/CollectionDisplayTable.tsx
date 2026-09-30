import AppTable, { type TableColumn } from '#/ui/table/AppTable'
import CollectionDisplay, {
  type CollectionDisplayBaseProps,
} from '#/ui/collection/CollectionDisplay'
import { Card } from '@mantine/core'

function CollectionDisplayTable({
  records,
  columns,
  onRowClick,
  withSelection,
  onSelectionChange,
  height,
  ...base
}: CollectionDisplayBaseProps & {
  records: any[]
  columns: TableColumn[]
  onRowClick?: (data: any) => void
  withSelection?: boolean
  onSelectionChange?: (selected: any[]) => void
  height?: string
  hidden?: boolean
}) {
  return (
    <CollectionDisplay
      {...base}
      renderBody={() => (
        <Card radius="md" shadow="xs">
          <Card.Section p="xs">
            <AppTable
              records={records}
              columns={columns}
              onRowClick={onRowClick}
              withSelection={withSelection}
              onSelectionChange={onSelectionChange}
              height={height}
              loading={base.controller?.isLoading}
              onPageChange={base.controller?.onPaginate}
              pagination={
                (base.controller?.meta as any)?.pagination && !base.hidePlugins?.pagination
                  ? {
                      page: (base.controller?.meta as any).pagination.page ?? 1,
                      limit: (base.controller?.meta as any).pagination.limit ?? 10,
                    }
                  : undefined
              }
            />
          </Card.Section>
        </Card>
      )}
    />
  )
}

export default CollectionDisplayTable
