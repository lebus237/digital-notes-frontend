import type { ReactNode } from 'react'
import { Select as MantineSelect, type SelectProps as MantineSelectProps } from '@mantine/core'

export type SelectOption = { value: string; label: string }

export type SelectInputProps = Omit<MantineSelectProps, 'value' | 'onChange' | 'onBlur' | 'error' | 'data'> & {
   value?: string | null
   onChange?: (value: string | null) => void
   onBlur?: () => void
   error?: ReactNode
   data?: Array<string | SelectOption>
}

export function SelectInput({ value, onChange, onBlur, ...props }: SelectInputProps) {
   const normalized = value === '' ? null : (value ?? null)
   return (
      <MantineSelect
         {...props}
         value={normalized}
         onBlur={onBlur}
         onChange={(next) => onChange?.(next)}
      />
   )
}
