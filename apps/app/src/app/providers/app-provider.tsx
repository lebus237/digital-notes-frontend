import { MantineProvider } from '@mantine/core'
import type { ReactNode } from 'react'

export function AppProvider({ children }: Readonly<{ children: ReactNode }>) {
  return <MantineProvider>{children}</MantineProvider>
}
