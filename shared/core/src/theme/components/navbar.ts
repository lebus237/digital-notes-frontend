import { AppShell } from '@mantine/core'

export const AppShellNavbarComponent = AppShell.Navbar.extend({
   styles: {
      navbar: {
         backgroundColor: 'light-dark(#2d3748, var(--mantine-color-dark-9))',
         border: 'none',
         borderRight:
            'light-dark(1px solid rgba(255, 255, 255, 0.1), 1px solid var(--mantine-color-dark-5))',
      },
   },
})
