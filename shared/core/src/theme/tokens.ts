/**
 * Semantic defaults shared by all themed Mantine components.
 * Import these instead of hardcoding radius / size / shadow keys.
 */
export const DEFAULT_RADIUS = 'sm' as const
export const DEFAULT_SIZE = 'sm' as const
export const DEFAULT_SHADOW = 'sm' as const
export const OVERLAY_SHADOW = 'xl' as const

/** Flush panels (drawers) stay square against the viewport edge. */
export const FLUSH_RADIUS = 'none' as const

/** CSS var for the shared radius — use in inline styles / SCSS. */
export const DEFAULT_RADIUS_CSS = `var(--mantine-radius-${DEFAULT_RADIUS})`

export const controlDefaultProps = {
   radius: DEFAULT_RADIUS,
   size: DEFAULT_SIZE,
} as const

export const comboboxDefaultProps = {
   withinPortal: true,
   zIndex: 2000,
} as const

export const inputLabelStyles = {
   fontSize: 'var(--mantine-font-size-sm)',
   fontWeight: '300',
   color: 'light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-1))',
} as const
