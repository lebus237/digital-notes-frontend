import { useEffect, useState } from 'react'
import { getCachedUser, type SessionUser } from './session'

/**
 * Hydration-safe access to the cached session user.
 *
 * Reads `localStorage` only in an effect, so the server HTML and the client's
 * first render both see `null` (identical output, no hydration mismatch).
 * The cached user arrives on the re-render right after mount — well before
 * the background `/me` validation resolves.
 *
 * Never call `getCachedUser()` / `hasAnyRole()` during render; use this +
 * `hasAnyRoleIn()` instead.
 */
export function useCachedUser(): SessionUser | null {
  const [user, setUser] = useState<SessionUser | null>(null)

  useEffect(() => {
    setUser(getCachedUser())
  }, [])

  return user
}
