import axios from '#/infra/http/axios-client'
import LocalStorage from '#/infra/local-storage/LocalStorage'

export const authSuccess = (props: any) => {
   if (typeof window !== 'undefined') {
      LocalStorage.setAuthToken(props.token)
      LocalStorage.setRefreshToken(props.refreshToken ?? '')
      LocalStorage.setAppContext(props.context)
   }

   axios.defaults.headers.Authorization = `Bearer ${props.token}`
}

export const logout = () => {
   /**
    * Should not provide redirect and reload arguments at the same time
    * */

   delete axios.defaults.headers.Authorization

   LocalStorage.clearAll()
   window.location.reload()
}
