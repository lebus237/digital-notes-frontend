import { NavLink } from '@mantine/core'

// @ts-ignore
import classes from './navLink.module.scss'

export const NavLinkComponent = NavLink.extend({
   classNames: {
      root: classes.root,
   },
   styles: {
      label: {
         fontWeight: 500,
      },
   },
})
