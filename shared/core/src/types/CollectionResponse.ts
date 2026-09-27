export type CollectionResponseType<T> = {
   data: T[]
   meta: Record<string, any>
   analytics?: any
}
