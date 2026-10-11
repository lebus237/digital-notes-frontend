import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ensureApiConfigured } from '@digitalnotes/core'
import { queryClient } from '@/shared/api/query-client'

ensureApiConfigured()

export function QueryProvider({ children }: Readonly<{ children: ReactNode }>) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
