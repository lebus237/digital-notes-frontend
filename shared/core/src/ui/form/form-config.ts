import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './context'
import { Email, type EmailProps } from './inputs/email'
import { NumberFieldInput, type NumberInputProps } from './inputs/number-input'
import { Password, type PasswordProps } from './inputs/password'
import { SelectInput, type SelectInputProps } from './inputs/select'
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
      Select: withFieldContext<SelectInputProps>(SelectInput),
      NumberInput: withFieldContext<NumberInputProps>(NumberFieldInput),
   },
   formComponents: {},
})
