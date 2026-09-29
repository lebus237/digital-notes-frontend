import { useFormContext } from './context'
import type { EmailProps } from './inputs/email'
import type { PasswordProps } from './inputs/password'
import type { TextAreaProps } from './inputs/text-area'
import type { TextInputProps } from './inputs/text-input'

export interface FormFieldProps {
   name: string
}

export function TextInput(props: TextInputProps & FormFieldProps) {
   const form = useFormContext()
   return <form.AppField name={props.name}>{(field: any) => <field.TextInput {...props} />}</form.AppField>
}

export function Email(props: EmailProps & FormFieldProps) {
   const form = useFormContext()
   return <form.AppField name={props.name}>{(field: any) => <field.Email {...props} />}</form.AppField>
}

export function Password(props: PasswordProps & FormFieldProps) {
   const form = useFormContext()
   return <form.AppField name={props.name}>{(field: any) => <field.Password {...props} />}</form.AppField>
}

export function TextArea(props: TextAreaProps & FormFieldProps) {
   const form = useFormContext()
   return <form.AppField name={props.name}>{(field: any) => <field.TextArea {...props} />}</form.AppField>
}
