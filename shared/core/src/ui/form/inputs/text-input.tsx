import type { ReactNode } from 'react'
import { TextInput as MantineTextInput, type TextInputProps as MantineTextInputProps } from '@mantine/core'

export type TextInputProps = Omit<MantineTextInputProps, 'value' | 'onChange' | 'onBlur' | 'error'> & {
   value?: string
   onChange?: (value: string) => void
   onBlur?: () => void
   error?: ReactNode
}

export function TextInput({ value, onChange, onBlur, ...props }: TextInputProps) {
   return (
      <MantineTextInput
         {...props}
         value={value ?? ''}
         onBlur={onBlur}
         onChange={(event) => onChange?.(event.currentTarget.value)}
      />
   )
}
