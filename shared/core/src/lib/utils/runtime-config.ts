/**
 * Runtime configuration injected at container start by `docker-entrypoint.sh`
 * into `/config.js` (served as a static asset at `/config.js`).
 *
 * Container `API_URL` overrides build-time `VITE_API_ENDPOINT` when set; otherwise
 * the value from `.env` at build time is used.
 */
export interface RuntimeConfig {
   /** Set by docker-entrypoint.sh; when true, runtime values override build-time env */
   __INJECTED__?: boolean
   /** Injected from container env `API_URL` via docker-entrypoint.sh */
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

/**
 * HTTP action paths already start with `/api/...`. Compose often sets
 * `API_URL=/api` to mean “API lives on the same origin under /api”, which
 * maps to an empty axios baseURL (requests become `/api/...`, not `/api/api/...`).
 */
export const normalizeApiBaseUrl = (baseUrl: string): string => {
   const value = baseUrl.trim()
   if (value === '/api' || value === '/api/') return ''
   return value
}

/**
 * Resolve the API base URL for axios and related helpers:
 *   1. non-empty runtime `API_URL` / legacy `APP_URL` from `/config.js`
 *   2. otherwise `VITE_API_ENDPOINT` from the app `.env` (build-time)
 */
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
