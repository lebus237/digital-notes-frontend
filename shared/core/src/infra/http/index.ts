import type { DocumentExtension } from '#/types'

export { default as axios } from './axios-client'
export { callAction, callActionWithId } from './helpers/action-helpers'
export * from './helpers/api-keys-helper'
export * from './helpers/session-helper'

export interface Pagination {
   page: number
   limit: number
   total?: number | undefined
}

export interface CollectionQueryType {
   pagination: Pagination
   query?: string
   order?: string
   filter?: string
   dateRange?: { fromDate?: string; toDate?: string }
   exports?: Array<{ type: DocumentExtension; url: string }>
}
