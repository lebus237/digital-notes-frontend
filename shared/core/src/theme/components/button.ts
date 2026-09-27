import { Button } from '@mantine/core'

import { controlDefaultProps } from '../tokens'

export const ButtonComponent = Button.extend({
   defaultProps: controlDefaultProps,
   styles: {
      root: {
         fontWeight: 400,
      },
   },
})
