import { queryClient } from "./query-client";

/**
 * Refresh cached collections whose query key starts with `queryKey`.
 * Pair it with `actionKeys` so readers and writers share the same key:
 * `revalidateQuery(actionKeys.listUniversities)`.
 */
export function revalidateQuery(queryKey: string | readonly unknown[]) {
  return queryClient.invalidateQueries({
    queryKey: Array.isArray(queryKey) ? [...queryKey] : [queryKey],
  });
}
