import { Paper } from '@mantine/core'

import { DEFAULT_RADIUS, DEFAULT_SHADOW } from '../tokens'

export const PaperComponent = Paper.extend({
   defaultProps: {
      radius: DEFAULT_RADIUS,
      shadow: DEFAULT_SHADOW,
   },
   styles: {
      root: {
         backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-6))',
         border: 'light-dark(1px solid #f1f3f4, 1px solid var(--mantine-color-dark-5))',
      },
   },
})
