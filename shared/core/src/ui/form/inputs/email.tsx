import { TextInput, type TextInputProps } from './text-input'

export type EmailProps = Omit<TextInputProps, 'type'>

export function Email(props: EmailProps) {
   return <TextInput {...props} type="email" />
}
