import { AppShell } from '@mantine/core'

export const AppShellHeaderComponent = AppShell.Header.extend({
   styles: {
      header: {
          backgroundColor: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-8))',
          borderBottom: 'light-dark(1px solid var(--mantine-color-gray-2), 1px solid var(--mantine-color-dark-6))',
      },
   },
})
