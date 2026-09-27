import { AppShell } from '@mantine/core'

export const AppShellHeaderComponent = AppShell.Header.extend({
   styles: {
      header: {
         backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-6))',
         borderBottom: 'light-dark(1px solid #f1f3f4, 1px solid var(--mantine-color-dark-5))',
      },
   },
})
