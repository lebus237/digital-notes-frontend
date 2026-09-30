import { createTheme, type MantineColorsTuple } from '@mantine/core'

const ink: MantineColorsTuple = [
  '#f9fafb',
  '#f3f4f6',
  '#e5e7eb',
  '#d1d5db',
  '#9ca3af',
  '#6b7280',
  '#4b5563',
  '#374151',
  '#1f2937',
  '#030712',
]

export const theme = createTheme({
  primaryColor: 'ink',
  colors: { ink },
  primaryShade: { light: 9, dark: 2 },
  defaultRadius: 'md',
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  headings: {
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  },
})
