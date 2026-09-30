import { axios, getApiEndpoint, LocalStorage } from '@digitalnotes/core'

const appToken = LocalStorage.getAuthToken()
axios.defaults.baseURL = getApiEndpoint()

if (appToken) {
  axios.defaults.headers.common.Authorization = `Bearer ${appToken}`
}

export * from './organisation'
export * from './courses'
export * from './employees'
export * from './notes'
export * from './users'
