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
