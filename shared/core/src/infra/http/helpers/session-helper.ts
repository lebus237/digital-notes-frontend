import axios from '#/infra/http/axios-client'
import LocalStorage from '#/infra/local-storage/LocalStorage'

type AuthPayload = {
   accessToken?: string
   /** Legacy name kept for older callers. */
   token?: string
   refreshToken?: string
   context?: unknown
   user?: unknown
}

export const authSuccess = (props: AuthPayload) => {
   const accessToken = props.accessToken ?? props.token
   if (!accessToken) return

   if (typeof window !== 'undefined') {
      LocalStorage.setAuthToken(accessToken)
      if (props.refreshToken) LocalStorage.setRefreshToken(props.refreshToken)
      if (props.context !== undefined) {
         LocalStorage.setAppContext(props.context as object)
      }
      if (props.user !== undefined) {
         LocalStorage.setUser(props.user as object)
      }
   }

   axios.defaults.headers.Authorization = `Bearer ${accessToken}`
}

export const clearSession = () => {
   delete axios.defaults.headers.Authorization

   LocalStorage.clearAll()
}

/**
 * Revokes the current session server-side, then clears local credentials.
 *
 * Tokens are read before `clearSession` because the request must carry the
 * access token and the refresh token even though the local session disappears
 * immediately. Network failures are ignored: the user is logged out locally
 * either way.
 */
export const endSession = async () => {
   const accessToken = LocalStorage.getAuthToken()
   const refreshToken = LocalStorage.getRefreshToken()

   clearSession()

   if (!accessToken) return

   try {
      await axios.post(
         '/api/logout',
         refreshToken ? { refreshToken } : undefined,
         { headers: { Authorization: `Bearer ${accessToken}` } },
      )
   } catch {
      // Local session is already gone; server-side revocation is best effort.
   }
}

export const logout = async (redirectTo = '/login') => {
   await endSession()

   if (typeof window !== 'undefined') {
      window.location.replace(redirectTo)
   }
}
