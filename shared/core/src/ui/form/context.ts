import { createContext, useContext } from 'react'
import { createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

export const FormContext = createContext<any | null>(null)

export function useFormContext() {
   const form = useContext(FormContext)
   if (!form) {
      throw new Error('Form fields must be used within a FormWrapper')
   }
   return form
}
