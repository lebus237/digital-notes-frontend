import { AppShell } from '@mantine/core'

export const AppShellNavbarComponent = AppShell.Navbar.extend({
   styles: {
      navbar: {
          backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
         border: 'none',
         borderRight:
             'light-dark(1px solid var(--mantine-color-gray-2), 1px solid var(--mantine-color-dark-6))',
      },
   },
})
