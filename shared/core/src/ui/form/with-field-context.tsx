import type { ComponentType, ReactNode } from 'react'
import { useFieldContext } from './context'

export interface FieldValueProps {
   value?: string
   onChange?: (value: string) => void
   onBlur?: () => void
   error?: ReactNode
}

export interface WithFormFieldProps {
   name: string
}

function firstErrorMessage(errors: Array<unknown>): string | undefined {
   const first = errors[0]
   if (typeof first === 'string') return first
   if (typeof first === 'object' && first !== null && 'message' in first) {
      const message = (first as { message?: unknown }).message
      if (typeof message === 'string') return message
   }
   return undefined
}

export function withFieldContext<TProps extends FieldValueProps>(Component: ComponentType<TProps>) {
   return function BoundField(props: TProps & WithFormFieldProps) {
      const { error: explicitError, ...componentProps } = props
      const field = useFieldContext<string>()
      const message = firstErrorMessage(field.state.meta.errors ?? [])
      return (
         <Component
            {...(componentProps as TProps)}
            value={field.state.value ?? ''}
            onChange={(value: string) => field.handleChange(value)}
            onBlur={() => field.handleBlur()}
            error={explicitError ?? (!field.state.meta.isValid ? message : undefined)}
         />
      )
   }
}
