import {
   IconBellRinging2,
   IconChecks,
   IconExclamationMark,
   IconInfoSmall,
} from '@tabler/icons-react'
import { NotificationType } from '#/types'

export const resolveNotification = (type: string): any => {
   switch (type) {
      case NotificationType.SUCCESS:
         return {
            type: 'green',
            title: 'notification.successful',
            message: 'message.succeed.content',
         }
      case NotificationType.ERROR:
         return {
            color: 'red',
            title: 'notification.failed',
            message: 'message.failed.content',
         }
      case NotificationType.WARNING:
         return {
            color: 'yellow',
            title: 'notification.warning',
            message: 'message.warning.content',
         }
      case NotificationType.INFO:
         return {
            color: 'blue',
            title: 'notification.information',
            message: 'message.information.content',
         }
      default:
         return {
            color: 'blue',
            label: 'notification',
            message: 'message.notification.content',
         }
   }
}

export const resolveNotificationIcon = (type: string): any => {
   switch (type) {
      case NotificationType.SUCCESS:
         return <IconChecks />
      case NotificationType.ERROR:
         return <IconExclamationMark />
      case NotificationType.WARNING:
         return <IconBellRinging2 />
      case NotificationType.INFO:
         return <IconInfoSmall />
      default:
         return undefined
   }
}

export function getLetters(str?: string) {
   if (!str) return ''

   const words = str.trim().split(/\s+/)

   if (words.length === 1) {
      const word = words[0]
      return word.slice(0, 2).toUpperCase()
   } else {
      const first = words[0][0]
      const last = words[words.length - 1][0]
      return (first + last).toUpperCase()
   }
}
