import { Drawer } from '@mantine/core'

import { FLUSH_RADIUS, OVERLAY_SHADOW } from '../tokens'

export const DrawerComponent = Drawer.extend({
   defaultProps: {
      radius: FLUSH_RADIUS,
      shadow: OVERLAY_SHADOW,
   },
   styles: {
      content: {
         backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-7))',
      },
      header: {
         backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
         borderBottom:
            'light-dark(3px solid --mantine-color-gray-3), 3px solid var(--mantine-color-dark-5))',
         paddingBottom: '1rem',
      },
      close: {
         backgroundColor: 'transparent',
      },
   },
})
