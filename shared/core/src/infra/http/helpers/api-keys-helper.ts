import { toKebabCase } from '#/lib/utils'

/**
 * Creates a typed map of query keys from an API module's export names.
 *
 * @example
 * ```ts
 * import * as utils from '@infras/utils'
 *
 * const actionKeys = createQueryKeys(utils)
 * // actionKeys.fetchLocations  => 'fetch-locations'
 * // actionKeys.createProduct   => 'create-product'
 *
 * useQuery({
 *   queryKey: [actionKeys.fetchLocations, id],
 *   queryFn: () => utils.fetchLocations(id),
 * })
 * ```
 */
export function createQueryKeys<T extends Record<string, unknown>>(
   apiModule: T,
): { [K in keyof T]: string } {
   const keys = {} as { [K in keyof T]: string }

   for (const key of Object.keys(apiModule) as Array<keyof T & string>) {
      const action = apiModule[key] as { queryKey?: string } | undefined
      keys[key] = action?.queryKey || toKebabCase(key)
   }

   return keys
}
