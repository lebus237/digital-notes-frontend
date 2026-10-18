import { Card } from '@mantine/core'

import { DEFAULT_RADIUS } from '../tokens'

export const CardComponent = Card.extend({
   defaultProps: {
      radius: DEFAULT_RADIUS,
      padding: 'lg',
   },
   styles: {
      root: {
          backgroundColor: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-8))',
         transition: 'background-color 0.2s ease, border-color 0.2s ease',
      },
   },
})
