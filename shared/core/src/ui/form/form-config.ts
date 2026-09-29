import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './context'
import { Email, type EmailProps } from './inputs/email'
import { Password, type PasswordProps } from './inputs/password'
import { TextArea, type TextAreaProps } from './inputs/text-area'
import { TextInput, type TextInputProps } from './inputs/text-input'
import { withFieldContext } from './with-field-context'

export const { useAppForm } = createFormHook({
   fieldContext,
   formContext,
   fieldComponents: {
      TextInput: withFieldContext<TextInputProps>(TextInput),
      Email: withFieldContext<EmailProps>(Email),
      Password: withFieldContext<PasswordProps>(Password),
      TextArea: withFieldContext<TextAreaProps>(TextArea),
   },
   formComponents: {},
})
