import {axios, getApiEndpoint, LocalStorage} from '@digitalnotes/core'

const appToken = LocalStorage.getAuthToken()
axios.defaults.baseURL = getApiEndpoint()

if (appToken) {
   axios.defaults.headers.Authorization = `Bearer ${appToken}`
}

export * from './auth'
