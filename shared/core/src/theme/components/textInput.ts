import { TextInput, NumberInput, Textarea, PasswordInput } from '@mantine/core'

import { controlDefaultProps, inputLabelStyles } from '../tokens'

// @ts-ignore
import classes from './textInput.module.scss'

const defaultProps = {
   ...controlDefaultProps,
   variant: 'default',
}

const styles = {
   label: {
      ...inputLabelStyles,
      padding: '2px 0',
   },
   error: {
      fontSize: 'var(--mantine-font-size-sm)',
      fontWeight: '200',
      fontStyle: 'italic',
      padding: '0',
   },
}

const inputClassNames = {
   input: classes.input,
}

export const TextInputComponent = TextInput.extend({
   defaultProps,
   classNames: inputClassNames,
   styles,
})

export const NumberInputComponent = NumberInput.extend({
   defaultProps,
   classNames: inputClassNames,
   styles,
})

export const TextareaComponent = Textarea.extend({
   defaultProps: {
      ...defaultProps,
      minRows: 6,
   },
   classNames: inputClassNames,
   styles,
})

export const PasswordInputComponent = PasswordInput.extend({
   defaultProps,
   classNames: inputClassNames,
   styles,
})
