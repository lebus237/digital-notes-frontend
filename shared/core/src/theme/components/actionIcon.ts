import { ActionIcon } from '@mantine/core'

import { controlDefaultProps } from '../tokens'

// @ts-ignore
import classes from './actionIcon.module.scss'

export const ActionIconComponent = ActionIcon.extend({
   defaultProps: controlDefaultProps,
   classNames: {
      root: classes.root,
   },
})
