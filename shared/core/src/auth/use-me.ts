import { useQuery } from '@tanstack/react-query'
import { fetchMe } from './me'

/**
 * Authoritative session state. Runs in the background alongside the already
 * rendered shell — it never blocks navigation. `staleTime` of 5 minutes keeps
 * repeat visits free; 401/refresh handling lives in the axios interceptor.
 */
export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    staleTime: 5 * 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  })
}
