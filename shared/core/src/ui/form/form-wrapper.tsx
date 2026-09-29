import type { SubmitEvent, ReactNode } from 'react'
import type { FormOptions } from '@tanstack/react-form'
import { FormContext } from './context'
import { useAppForm } from './form-config'

export type AnyFormOptions<TFormData> = FormOptions<TFormData, any, any, any, any, any, any, any, any, any, any>

export interface FormWrapperProps<TFormData,TResult = unknown> {
   formOptions: Omit<AnyFormOptions<TFormData>, 'onSubmit'>
   onSubmit: (value: TFormData) => void | Promise<void>
   children: ReactNode
   initialValues?: TFormData
   onSuccess?: (data?: TResult) => void
   onError?: (error: { message: string; errors?: any[] }) => void;
}

export function FormWrapper<TFormData>({ formOptions, onSubmit, children }: FormWrapperProps<TFormData>) {
   const form = useAppForm({
      ...formOptions,
      onSubmit: async ({ value }: { value: TFormData }) => {
         await onSubmit(value)
      },
   })

   function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault()
      void form.handleSubmit()
   }

   return (
      <FormContext.Provider value={form}>
         <form onSubmit={handleSubmit} noValidate>
            <form.AppForm>{children}</form.AppForm>
         </form>
      </FormContext.Provider>
   )
}
