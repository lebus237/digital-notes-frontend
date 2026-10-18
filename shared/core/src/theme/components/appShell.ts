import { AppShell } from '@mantine/core'

export const AppShellComponent = AppShell.extend({
   styles: {
      root: {
          backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
      },
      main: {
          backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
      },
   },
})
