import { AppShell } from '@mantine/core'

export const AppShellComponent = AppShell.extend({
   styles: {
      root: {
         backgroundColor: 'light-dark(#f8f9fa, var(--mantine-color-dark-7))',
      },
      main: {
         backgroundColor: 'light-dark(#f8f9fa, var(--mantine-color-dark-7))',
      },
   },
})
