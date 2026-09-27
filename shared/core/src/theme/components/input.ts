import { Input, InputBase } from '@mantine/core'

import { controlDefaultProps } from '#/theme'

// @ts-ignore
import classes from './input.module.scss'

export const InputComponent = Input.extend({
   defaultProps: controlDefaultProps,
   classNames: {
      input: classes.input,
   },
})

export const InputBaseComponent = InputBase.extend({
   defaultProps: controlDefaultProps,
})
