'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useTolgee } from '@tolgee/react'
import type { TranslationKey } from '@tolgee/core'

export function useTranslate() {
   const tolgee = useTolgee(['language'])

   const trans = (
      label: TranslationKey,
      vars?: Record<string, any>,
      defaultValue?: string,
   ): string => {
      return tolgee.t(label, label as any, { noWrap: true, ...vars }) ?? defaultValue ?? label
   }

   const transDate = (date?: any, dateFormat?: any): any => {
      if (date) {
         return format(new Date(date), dateFormat ?? 'dd, MMM yyyy', {
            locale: fr,
         })
      }

      return date
   }

   return {
      trans,
      transDate,
      lang: tolgee.getLanguage(),
      // Never let a failed language load crash the app (e.g. Tolgee API is
      // down in dev): log it and let the UI keep running with current data.
      changeLanguage: (language: string) =>
         tolgee.changeLanguage(language).catch((error: unknown) => {
            console.warn('[tolgee] Failed to change language:', error)
         }),
   }
}
