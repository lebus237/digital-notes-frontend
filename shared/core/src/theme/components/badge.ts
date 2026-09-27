import { Badge } from '@mantine/core'

import { DEFAULT_RADIUS } from '../tokens'

export const BadgeComponent = Badge.extend({
   defaultProps: {
      radius: DEFAULT_RADIUS,
   },
   styles: {
      root: {
         fontWeight: 500,
         fontSize: '0.75rem',
      },
   },
})
