import type { ReactNode } from 'react'
import { NumberInput as MantineNumberInput, type NumberInputProps as MantineNumberInputProps } from '@mantine/core'

export type NumberInputProps = Omit<MantineNumberInputProps, 'value' | 'onChange' | 'onBlur' | 'error'> & {
   value?: number | string
   onChange?: (value: number | string) => void
   onBlur?: () => void
   error?: ReactNode
}

export function NumberFieldInput({ value, onChange, onBlur, ...props }: NumberInputProps) {
   return (
      <MantineNumberInput
         {...props}
         value={value ?? ''}
         onBlur={onBlur}
         onChange={(next) => onChange?.(next as number | string)}
      />
   )
}
