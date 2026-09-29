import type { ReactNode } from 'react'
import { Textarea as MantineTextarea, type TextareaProps as MantineTextareaProps } from '@mantine/core'

export type TextAreaProps = Omit<MantineTextareaProps, 'value' | 'onChange' | 'onBlur' | 'error'> & {
   value?: string
   onChange?: (value: string) => void
   onBlur?: () => void
   error?: ReactNode
}

export function TextArea({ value, onChange, onBlur, ...props }: TextAreaProps) {
   return (
      <MantineTextarea
         {...props}
         value={value ?? ''}
         onBlur={onBlur}
         onChange={(event) => onChange?.(event.currentTarget.value)}
      />
   )
}
