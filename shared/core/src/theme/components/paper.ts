import { Paper } from '@mantine/core'

import { DEFAULT_RADIUS, DEFAULT_SHADOW } from '../tokens'

export const PaperComponent = Paper.extend({
   defaultProps: {
      radius: DEFAULT_RADIUS,
      shadow: DEFAULT_SHADOW,
   },
   styles: {
      root: {
          backgroundColor: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-8))',
          border: 'light-dark(1px solid var(--mantine-color-gray-2), 1px solid var(--mantine-color-dark-6))',
      },
   },
})
