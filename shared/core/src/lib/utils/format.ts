export const formatPrice = (amount: number | string, currency?: string | undefined) => {
   return `${(amount ?? 0)?.toLocaleString()} ${currency ?? 'XAF'}`
}

export const formatPhone = (phone?: string | null, locale?: string): string => {
   if (!phone) return '—'
   const digits = String(phone).replace(/[^\d+]/g, '')
   const hasPrefix = digits.startsWith('+')
   const prefixMatch = hasPrefix ? digits.match(/^\+(\d{1,3})(.*)$/) : null
   if (prefixMatch) {
      const [, cc, rest] = prefixMatch
      const grouped = rest.replace(/(\d{2,3})(?=\d)/g, '$1 ').trim()
      return `+${cc} ${grouped}`
   }
   const num = Number(digits)
   if (!Number.isNaN(num)) return num.toLocaleString(locale)
   return digits
}

export const timeToMinutes = (time: string): number => {
   const [hours, minutes] = time.split(':').map(Number)
   return hours * 60 + minutes
}

export const minutesToTime = (minutes: number): string => {
   const hours = Math.floor(minutes / 60)
   const remainingMinutes = minutes % 60
   return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`
}
