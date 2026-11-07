import { QueryClient } from '@tanstack/react-query'

const isServer = typeof window === 'undefined'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: !isServer,
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})
