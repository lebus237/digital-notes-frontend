import { MantineProvider } from '@mantine/core'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { theme } from '@digitalnotes/core'
import { queryClient } from '@/shared/api/query-client'

export function AppProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        {children}
      </MantineProvider>
    </QueryClientProvider>
  )
}
