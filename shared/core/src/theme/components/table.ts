import { Table } from '@mantine/core'

export const TableComponent = Table.extend({
   styles: {
      table: {
          backgroundColor: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-8))',
      },
      thead: {
          backgroundColor: 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7))',
      },
      th: {
          color: 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-1))',
         fontWeight: 600,
         fontSize: '0.8rem',
         // borderBottom: 'light-dark(1px solid #dee2e6, 1px solid var(--mantine-color-dark-4))',
      },
      td: {
         // borderBottom: 'light-dark(1px solid #f1f3f4, 1px solid var(--mantine-color-dark-5))',
         fontSize: '0.875rem',
          color: 'light-dark(var(--mantine-color-gray-8), var(--mantine-color-dark-1))',
      },
   },
})
