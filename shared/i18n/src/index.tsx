'use client'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { TolgeeProvider, T } from '@tolgee/react'
import type { TolgeeInstance } from '@tolgee/react'

dayjs.extend(utc)
dayjs.extend(timezone)

export * from './languages'

export function I18nLabel({ label, vars }: { label: any; vars?: any }): any {
   return <T keyName={label} params={vars} />
}

export function I18nDate(props: { date?: any; vars?: any; format?: string }): any {
   if (props.date !== undefined && props.date !== null) {
      return dayjs
         .utc(props.date)
         .local()
         .format(props.format ?? 'D MMM YYYY')
   } else {
      return '--'
   }
}

export function TranslationProvider({
   children,
   instance,
}: {
   children: React.ReactNode
   instance: TolgeeInstance
}) {
   return <TolgeeProvider tolgee={instance}>{children}</TolgeeProvider>
}

export * from './use-translate'
