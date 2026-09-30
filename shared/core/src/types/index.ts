import type { EnumValues } from './utils/enums'
export * from './DocumentFile'
export * from './collection'

export type ModuleKey = string

export interface BaseAppContext {
   userId: string
   isOwner: boolean
   access: EnumValues<string>[]
   modules: string[]
}

export interface AppContextType extends BaseAppContext {
}

export enum NotificationType {
   SUCCESS = 'success',
   ERROR = 'error',
   INFO = 'info',
   WARNING = 'warning',
   LOADING = 'loading',
}

export enum Gender {
   FEMALE = 'female',
   UNKNOW = 'unknown',
   MALE = 'male',
}

export { EnumHelper, type EnumValues } from './utils/enums'
