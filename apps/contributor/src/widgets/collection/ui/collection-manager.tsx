import { Table, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import styles from './collection-manager.module.scss'

export type CollectionColumn<T> = {
  key: string
  title: string
  align?: 'left' | 'right'
  render: (row: T) => ReactNode
}

type CollectionManagerProps<T extends { id: string }> = {
  rows: T[]
  columns: Array<CollectionColumn<T>>
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filter?: ReactNode
  summary?: string
  emptyLabel: string
}

export function CollectionManager<T extends { id: string }>({
  rows,
  columns,
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filter,
  summary,
  emptyLabel,
}: Readonly<CollectionManagerProps<T>>) {
  return (
    <section className={styles.section}>
      <header className={styles.toolbar}>
        <p className={styles.summary} aria-live="polite">{summary}</p>
        <div className={styles.controls}>
          <TextInput
            className={styles.search}
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            placeholder={searchPlaceholder}
            leftSection={<IconSearch size={16} />}
            aria-label={searchPlaceholder}
          />
          {filter}
        </div>
      </header>
      {rows.length === 0 ? (
        <p className={styles.empty}>{emptyLabel}</p>
      ) : (
        <div className={styles.tableWrap}>
          <Table.ScrollContainer minWidth={640}>
            <Table verticalSpacing="md" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  {columns.map((column) => (
                    <Table.Th key={column.key} scope="col" ta={column.align}>
                      {column.title}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((row) => (
                  <Table.Tr key={row.id}>
                    {columns.map((column) => (
                      <Table.Td key={column.key} ta={column.align}>
                        {column.render(row)}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </div>
      )}
    </section>
  )
}
