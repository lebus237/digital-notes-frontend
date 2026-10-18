import { MantineProvider } from '@mantine/core'
import type { ReactNode } from 'react'
import { theme } from '@digitalnotes/core'

export function AppProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      {children}
    </MantineProvider>
  )
}
