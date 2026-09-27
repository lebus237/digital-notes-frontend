export const isEmptyString = (str?: string) =>
   (typeof str === 'string' && str.length === 0) || str == undefined

export const toKebabCase = (str: string): string =>
   str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
