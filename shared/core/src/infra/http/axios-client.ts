import axios, { type AxiosResponse } from 'axios'
import LocalStorage from '#/infra/local-storage/LocalStorage'
import { authSuccess } from '#/infra/http/helpers/session-helper'
import { getApiEndpoint } from '#/lib/utils/runtime-config'

const AxiosInstance = axios
export const getIsOk = (res: AxiosResponse<any>) => [200, 202, 201, 204, 203].includes(res.status)

let failedQueue: any[] = []
let isRefreshing = false

const processQueue = (error: any, token = null) => {
   failedQueue.forEach(prom => {
      if (error) {
         return prom.reject(error)
      } else {
         return prom.resolve(token)
      }
   })
   failedQueue = []
}

const AUTH_API_PATHS = ['/api/login', '/api/register', '/api/refresh-token']

const AUTH_PAGE_PATHS = [
   '/login',
   '/logout',
   '/register',
   '/forgot-password',
   '/reset-password',
   '/company/create',
   '/invitation',
]

const isAuthApiRequest = (url?: string): boolean =>
   !!url && AUTH_API_PATHS.some(path => url.includes(path))

const isAuthPage = (pathname: string): boolean =>
   AUTH_PAGE_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`))

const redirectToLogout = () => {
   if (typeof window !== 'undefined' && !isAuthPage(window.location.pathname)) {
      window.location.href = '/logout'
   }
}

AxiosInstance.interceptors.request.use((config) => {
   // Resolve baseURL per request so import order / SSR can't leave it empty.
   // getApiEndpoint() returns '' on the server or when no env is set -> keep relative URL then.
   const base = getApiEndpoint()
   if (base && !config.baseURL) {
      config.baseURL = base
   }
   // Refresh auth header per request so login/logout takes effect without reload.
   try {
      const token = LocalStorage.getAuthToken()
      if (token && !config.headers?.Authorization) {
         config.headers = config.headers ?? ({} as any)
         ;(config.headers as any).Authorization = `Bearer ${token}`
      }
   } catch {
      // ignore (SSR)
   }
   return config
})

AxiosInstance.interceptors.response.use(
   response => response,
   function (error) {
      const originalRequest = error.config

      if (originalRequest?.url?.includes('/api/refresh-token')) {
         failedQueue = []
         processQueue(error, null)
         isRefreshing = false
         redirectToLogout()

         return Promise.reject(error)
      }

      if (
         401 === error.response?.status &&
         !originalRequest?._retry &&
         !isAuthApiRequest(originalRequest?.url)
      ) {
         const refreshToken = LocalStorage.getRefreshToken()

         if (!refreshToken) {
            redirectToLogout()

            return Promise.reject(error)
         }

         if (isRefreshing) {
            delete axios.defaults.headers.Authorization

            return new Promise(function (resolve, reject) {
               failedQueue.push({ resolve, reject })
            })
               .then(token => {
                  originalRequest.headers.Authorization = `Bearer ${token}`

                  return axios(originalRequest) as any
               })
               .catch(err => {
                  return Promise.reject(err)
               })
         }

         originalRequest._retry = true
         isRefreshing = true

         return new Promise(function (resolve, reject) {
            axios
               .post('/api/refresh-token', { refreshToken })
               .then(({ data }) => {
                  authSuccess(data)
                  processQueue(null, data.token)
                  originalRequest.headers.Authorization = `Bearer ${data.token}`
                  isRefreshing = false
                  resolve(axios(originalRequest))
               })
               .catch(err => {
                  processQueue(err, null)
                  isRefreshing = false
                  reject(err)
               })
         })
      }

      return Promise.reject(error)
   },
)

export default AxiosInstance
