export interface RuntimeConfig {
   __INJECTED__?: boolean
   API_URL?: string
   /** @deprecated Use `API_URL` — kept for older deployed config.js files */
   APP_URL?: string
}

declare global {
   interface Window {
      __RUNTIME_CONFIG__?: RuntimeConfig
   }
}

const readBuildTimeApiUrl = (): string | undefined =>
   (import.meta as any).env?.VITE_API_ENDPOINT ??
   (typeof process !== 'undefined' ? process.env?.VITE_API_ENDPOINT : undefined)

const isRuntimeApiUrlSet = (value: string | undefined): value is string =>
   value !== undefined && value.trim() !== ''

export const normalizeApiBaseUrl = (baseUrl: string): string => {
   const value = baseUrl.trim()
   if (value === '/api' || value === '/api/') return ''
   return value
}

export const getApiEndpoint = (): string => {
   if (typeof window !== 'undefined') {
      const cfg = window.__RUNTIME_CONFIG__
      const runtime = isRuntimeApiUrlSet(cfg?.API_URL) ? cfg?.API_URL : cfg?.APP_URL

      if (isRuntimeApiUrlSet(runtime)) {
         return normalizeApiBaseUrl(runtime)
      }
   }

   return normalizeApiBaseUrl(readBuildTimeApiUrl() || '')
}
