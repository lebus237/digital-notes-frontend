import { Drawer } from '@mantine/core'

import { FLUSH_RADIUS, OVERLAY_SHADOW } from '../tokens'

export const DrawerComponent = Drawer.extend({
   defaultProps: {
      radius: FLUSH_RADIUS,
      shadow: OVERLAY_SHADOW,
   },
   styles: {
      content: {
          backgroundColor: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-8))',
      },
      header: {
          backgroundColor: 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
         borderBottom:
             'light-dark(1px solid var(--mantine-color-gray-2), 1px solid var(--mantine-color-dark-6))',
         paddingBottom: '1rem',
      },
      close: {
         backgroundColor: 'transparent',
      },
   },
})
