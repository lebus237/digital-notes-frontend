import { QueryClient } from '@tanstack/react-query'

/*
 * The public catalogue fetches through the same-origin `/api` proxy in the
 * browser. Disable automatic query execution during SSR so the server does
 * not try to resolve relative API URLs; the client hydrates and fetches.
 */
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
