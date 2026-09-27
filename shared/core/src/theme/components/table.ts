import { Table } from '@mantine/core'

export const TableComponent = Table.extend({
   styles: {
      table: {
         backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-6))',
      },
      thead: {
         backgroundColor: 'light-dark(#f8f9fa, var(--mantine-color-dark-5))',
      },
      th: {
         color: 'light-dark(#495057, var(--mantine-color-dark-0))',
         fontWeight: 600,
         fontSize: '0.8rem',
         // borderBottom: 'light-dark(1px solid #dee2e6, 1px solid var(--mantine-color-dark-4))',
      },
      td: {
         // borderBottom: 'light-dark(1px solid #f1f3f4, 1px solid var(--mantine-color-dark-5))',
         fontSize: '0.875rem',
         color: 'light-dark(#343a40, var(--mantine-color-dark-1))',
      },
   },
})
