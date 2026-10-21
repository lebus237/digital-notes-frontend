const ROUTE_PARAM_PATTERN = /\$[A-Za-z0-9_]+/g

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Strips query/hash and trailing slashes so paths can be compared reliably.
 */
export const normalizeRoutePath = (path: string): string => {
   const withoutHash = path.split('#')[0] ?? ''
   const withoutQuery = withoutHash.split('?')[0] ?? ''
   const trimmed = withoutQuery.replace(/\/+$/, '')

   return trimmed === '' ? '/' : trimmed
}

const buildRoutePattern = (path: string): RegExp => {
   const pattern = path
      .split('/')
      .map((segment) => {
         if (segment === '*') return '.*'
         if (segment.includes('$')) {
            return `${escapeRegExp(segment.replace(ROUTE_PARAM_PATTERN, ''))}[^/]+`
         }
         return escapeRegExp(segment)
      })
      .join('/')

   return new RegExp(`^${pattern}(/.*)?$`)
}

/**
 * Checks whether the given pathname belongs to the route described by `to`.
 * A route stays active for all of its subroutes (e.g. `/organisation` matches
 * `/organisation/departments`), but stops being active once another module is opened.
 */
export const isRouteActive = (pathname: string, to?: string): boolean => {
   if (!to) return false

   const target = normalizeRoutePath(to)
   const current = normalizeRoutePath(pathname)

   if (target === '/') return current === '/'
   if (target.includes('$') || target.includes('*')) {
      return buildRoutePattern(target).test(current)
   }

   return current === target || current.startsWith(`${target}/`)
}

/**
 * Checks whether the given pathname is exactly the route described by `to`.
 */
export const isRouteExact = (pathname: string, to?: string): boolean => {
   if (!to) return false

   return normalizeRoutePath(pathname) === normalizeRoutePath(to)
}

export const buildPath = (route: any, params: any = {}, hash: boolean = false, queries?: any) => {
   let path = Object.keys(params).reduce((acc, key) => {
      return acc.replace(`:${key}`, params[key])
   }, route)

   if (window.location.hash !== undefined && hash) {
      path = path + window.location.hash
   }

   if (queries && Object.keys(queries).length > 0) {
      const query = `?${Object.entries(queries)
         .filter(e => e[1] !== undefined)
         .map(e => e.join('='))
         .join('&')}`

      path = path + query
   }

   return path
}
