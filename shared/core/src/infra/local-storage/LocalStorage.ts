class LocalStorage {
   static isBrowser(): boolean {
      return typeof window !== 'undefined'
   }

   static setRefreshToken(refreshToken: string) {
      if (this.isBrowser()) {
         localStorage.setItem('app-refresh-token', refreshToken)
      }
   }

   static clearRefreshToken() {
      if (this.isBrowser()) {
         localStorage.removeItem('app-refresh-token')
      }
   }

   static getRefreshToken(): string | null {
      if (this.isBrowser()) {
         return localStorage.getItem('app-refresh-token')
      }
      return null
   }

   static setAuthToken(authToken: string) {
      if (this.isBrowser()) {
         localStorage.setItem('app-token', authToken)
      }
   }

   static clearAuthToken() {
      if (this.isBrowser()) {
         localStorage.removeItem('app-token')
      }
   }

   static getAuthToken(): string | null {
      if (this.isBrowser()) {
         return localStorage.getItem('app-token')
      }
      return null
   }

   static setAppContext(context: object) {
      if (this.isBrowser()) {
         localStorage.setItem('app-context', JSON.stringify(context))
      }
   }

   static clearAppContext() {
      if (this.isBrowser()) {
         localStorage.removeItem('app-context')
      }
   }

   static setInstance(context: object) {
      if (this.isBrowser()) {
         localStorage.setItem('instance', JSON.stringify(context))
      }
   }

   static getInstance(): any | null {
      if (this.isBrowser()) {
         try {
            const instance = localStorage.getItem('instance')
            return instance ? JSON.parse(instance) : null
         } catch {
            return null
         }
      }

      return null
   }

   static getAppContext(): any | null {
      if (this.isBrowser()) {
         try {
            const context = localStorage.getItem('app-context')
            return context ? JSON.parse(context) : null
         } catch {
            return null
         }
      }
      return null
   }

   static setSidebarMode(value: boolean) {
      if (this.isBrowser()) {
         localStorage.setItem('app-sidebar-mode', JSON.stringify(value))
      }
   }

   static getSidebarMode(): boolean {
      if (!this.isBrowser()) return false
      try {
         const stored = localStorage.getItem('app-sidebar-mode')
         return stored ? JSON.parse(stored) === true : false
      } catch {
         return false
      }
   }

   static setSidebarOpen(value: boolean) {
      if (this.isBrowser()) {
         localStorage.setItem('app-sidebar-open', JSON.stringify(value))
      }
   }

   static getSidebarOpen(): boolean {
      if (!this.isBrowser()) return false
      try {
         const stored = localStorage.getItem('app-sidebar-open')
         return stored ? JSON.parse(stored) === true : false
      } catch {
         return false
      }
   }

   static clearAll() {
      this.clearRefreshToken()
      this.clearAuthToken()
      this.clearAppContext()
   }
}

export default LocalStorage
