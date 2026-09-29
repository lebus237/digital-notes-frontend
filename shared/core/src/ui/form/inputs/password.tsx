import type { ReactNode } from 'react'
import { PasswordInput as MantinePasswordInput, type PasswordInputProps as MantinePasswordInputProps } from '@mantine/core'

export type PasswordProps = Omit<MantinePasswordInputProps, 'value' | 'onChange' | 'onBlur' | 'error'> & {
   value?: string
   onChange?: (value: string) => void
   onBlur?: () => void
   error?: ReactNode
}

export function Password({ value, onChange, onBlur, ...props }: PasswordProps) {
   return (
      <MantinePasswordInput
         {...props}
         value={value ?? ''}
         onBlur={onBlur}
         onChange={(event) => onChange?.(event.currentTarget.value)}
      />
   )
}
