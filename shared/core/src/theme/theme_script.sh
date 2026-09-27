#!/bin/bash

# Create theme directory structure
mkdir -p theme/components

echo "🚀 Creating Fixed Mantine Theme Files..."

# Create colors
cat > theme/colors << 'EOF'
export const colors = {
  orange: [
    '#fff4e6',
    '#ffe8cc',
    '#ffd09c',
    '#ffb366',
    '#ff9c3a',
    '#ff8c1a', // Main orange color
    '#e67c00',
    '#cc6f00',
    '#b36200',
    '#995500'
  ],
  gray: [
    '#f8f9fa',
    '#f1f3f4',
    '#e9ecef',
    '#dee2e6',
    '#ced4da',
    '#adb5bd',
    '#6c757d',
    '#495057',
    '#343a40',
    '#212529'
  ],
  dark: [
    '#C1C2C5', // 0 - lightest
    '#A6A7AB', // 1
    '#909296', // 2
    '#5c5f66', // 3
    '#373A40', // 4
    '#2C2E33', // 5
    '#25262b', // 6 - default dark background
    '#1A1B1E', // 7 - darker
    '#141517', // 8 - darkest
    '#101113'  // 9 - darkest for navbar
  ]
};
EOF

# Create typography
cat > theme/typography << 'EOF'
export const typography = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    sizes: {
      h1: { fontSize: '2rem', fontWeight: '600' },
      h2: { fontSize: '1.5rem', fontWeight: '600' },
      h3: { fontSize: '1.25rem', fontWeight: '600' },
      h4: { fontSize: '1.125rem', fontWeight: '600' },
    }
  }
};
EOF

# Create spacing
cat > theme/spacing << 'EOF'
export const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
};

export const radius = {
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
};

export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};
EOF

# Create globalStyles
cat > theme/globalStyles << 'EOF'
import type { MantineTheme, CSSVariablesResolver } from '@mantine/core';

export const globalStyles = (theme: MantineTheme) => ({
  body: {
    backgroundColor: 'light-dark(#f8f9fa, var(--mantine-color-dark-7))',
    color: 'light-dark(#343a40, var(--mantine-color-dark-0))',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },

  // Custom scrollbar styling
  '*::-webkit-scrollbar': {
    width: '8px',
  },
  '*::-webkit-scrollbar-track': {
    backgroundColor: 'light-dark(#f1f3f4, var(--mantine-color-dark-6))',
  },
  '*::-webkit-scrollbar-thumb': {
    backgroundColor: 'light-dark(#ced4da, var(--mantine-color-dark-4))',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: 'light-dark(#adb5bd, var(--mantine-color-dark-3))',
    },
  },
});

// CSS Variables resolver for better dark mode support
export const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--mantine-color-body': 'light-dark(#f8f9fa, var(--mantine-color-dark-7))',
    '--mantine-color-text': 'light-dark(#343a40, var(--mantine-color-dark-0))',
  },
  light: {},
  dark: {},
});
EOF

# Create other
cat > theme/other << 'EOF'
export const other = {
  sidebarWidth: '240px',
  headerHeight: '60px',
  contentPadding: '1.5rem',
};
EOF

# Create components/button - FIXED VERSION
cat > theme/components/button << 'EOF'
import { Button } from '@mantine/core';

export const ButtonComponent = Button.extend({
  defaultProps: {
    radius: 'md',
  },
  styles: {
    root: {
      fontWeight: 500,
      '&[data-variant="filled"]': {
        '&:not([data-disabled])': {
          '&[data-color="orange"]': {
            backgroundColor: 'var(--mantine-color-orange-5)',
            '&:hover': {
              backgroundColor: 'var(--mantine-color-orange-6)',
            },
          },
        },
      },
    },
  },
});
EOF

# Create components/card - FIXED VERSION
cat > theme/components/card << 'EOF'
import { Card } from '@mantine/core';

export const CardComponent = Card.extend({
  defaultProps: {
    radius: 'lg',
    shadow: 'sm',
    padding: 'lg',
  },
  styles: {
    root: {
      backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-6))',
      border: 'light-dark(1px solid #f1f3f4, 1px solid var(--mantine-color-dark-5))',
      transition: 'background-color 0.2s ease, border-color 0.2s ease',
    },
  },
});
EOF

# Create components/modal - FIXED VERSION
cat > theme/components/modal << 'EOF'
import { Modal } from '@mantine/core';

export const ModalComponent = Modal.extend({
  defaultProps: {
    radius: 'lg',
    shadow: 'xl',
  },
  styles: {
    content: {
      backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-7))',
    },
    header: {
      backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-7))',
      borderBottom: 'light-dark(1px solid #f1f3f4, 1px solid var(--mantine-color-dark-5))',
      paddingBottom: '1rem',
    },
  },
});
EOF

# Create components/textInput - FIXED VERSION
cat > theme/components/textInput << 'EOF'
import { TextInput } from '@mantine/core';

export const TextInputComponent = TextInput.extend({
  defaultProps: {
    radius: 'md',
  },
  styles: {
    input: {
      backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-6))',
      border: 'light-dark(1px solid #dee2e6, 1px solid var(--mantine-color-dark-4))',
      color: 'light-dark(#343a40, var(--mantine-color-dark-0))',
      '&:focus': {
        borderColor: 'var(--mantine-color-orange-5)',
        backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-5))',
      },
      '&::placeholder': {
        color: 'light-dark(#6c757d, var(--mantine-color-dark-2))',
      },
    },
  },
});
EOF

# Create components/select - FIXED VERSION
cat > theme/components/select << 'EOF'
import { Select } from '@mantine/core';

export const SelectComponent = Select.extend({
  defaultProps: {
    radius: 'md',
  },
  styles: {
    input: {
      backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-6))',
      border: 'light-dark(1px solid #dee2e6, 1px solid var(--mantine-color-dark-4))',
      color: 'light-dark(#343a40, var(--mantine-color-dark-0))',
      '&:focus': {
        borderColor: 'var(--mantine-color-orange-5)',
        backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-5))',
      },
    },
    dropdown: {
      backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-6))',
      border: 'light-dark(1px solid #dee2e6, 1px solid var(--mantine-color-dark-4))',
    },
    option: {
      color: 'light-dark(#343a40, var(--mantine-color-dark-0))',
      '&[data-selected]': {
        backgroundColor: 'var(--mantine-color-orange-5)',
        color: '#ffffff',
      },
      '&[data-hovered]': {
        backgroundColor: 'light-dark(rgba(255, 140, 26, 0.05), rgba(255, 140, 26, 0.1))',
      },
    },
  },
});
EOF

# Create components/navbar - FIXED VERSION
cat > theme/components/navbar << 'EOF'
import { AppShell } from '@mantine/core';

export const AppShellNavbarComponent = AppShell.Navbar.extend({
  styles: {
    navbar: {
      backgroundColor: 'light-dark(#2d3748, var(--mantine-color-dark-9))',
      border: 'none',
      borderRight: 'light-dark(1px solid rgba(255, 255, 255, 0.1), 1px solid var(--mantine-color-dark-5))',
    },
  },
});
EOF

# Create components/navLink - FIXED VERSION
cat > theme/components/navLink << 'EOF'
import { NavLink } from '@mantine/core';

export const NavLinkComponent = NavLink.extend({
  styles: {
    root: {
      color: 'light-dark(#adb5bd, var(--mantine-color-dark-2))',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'light-dark(#ffffff, var(--mantine-color-dark-0))',
      },
      '&[data-active]': {
        backgroundColor: 'var(--mantine-color-orange-5)',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: 'var(--mantine-color-orange-6)',
        },
      },
    },
    label: {
      fontWeight: 500,
    },
  },
});
EOF

# Create components/table - FIXED VERSION
cat > theme/components/table << 'EOF'
import { Table } from '@mantine/core';

export const TableComponent = Table.extend({
  styles: {
    table: {
      backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-6))',
    },
    thead: {
      backgroundColor: 'light-dark(#f8f9fa, var(--mantine-color-dark-5))',
    },
    th: {
      color: 'light-dark(#495057, var(--mantine-color-dark-0))',
      fontWeight: 600,
      fontSize: '0.875rem',
      borderBottom: 'light-dark(1px solid #dee2e6, 1px solid var(--mantine-color-dark-4))',
    },
    td: {
      borderBottom: 'light-dark(1px solid #f1f3f4, 1px solid var(--mantine-color-dark-5))',
      fontSize: '0.875rem',
      color: 'light-dark(#343a40, var(--mantine-color-dark-1))',
    },
  },
});
EOF

# Create components/badge - FIXED VERSION
cat > theme/components/badge << 'EOF'
import { Badge } from '@mantine/core';

export const BadgeComponent = Badge.extend({
  defaultProps: {
    radius: 'md',
  },
  styles: {
    root: {
      fontWeight: 500,
      fontSize: '0.75rem',
    },
  },
});
EOF

# Create components/actionIcon - FIXED VERSION
cat > theme/components/actionIcon << 'EOF'
import { ActionIcon } from '@mantine/core';

export const ActionIconComponent = ActionIcon.extend({
  defaultProps: {
    radius: 'md',
  },
  styles: {
    root: {
      '&[data-variant="light"]': {
        '&:hover': {
          backgroundColor: 'light-dark(rgba(255, 140, 26, 0.1), rgba(255, 140, 26, 0.15))',
        },
      },
      '&[data-variant="subtle"]': {
        color: 'light-dark(#6c757d, var(--mantine-color-dark-1))',
        '&:hover': {
          backgroundColor: 'light-dark(#f8f9fa, var(--mantine-color-dark-5))',
        },
      },
    },
  },
});
EOF

# Create components/tabs - FIXED VERSION
cat > theme/components/tabs << 'EOF'
import { Tabs } from '@mantine/core';

export const TabsComponent = Tabs.extend({
  styles: {
    tab: {
      fontWeight: 500,
      color: 'light-dark(#6c757d, var(--mantine-color-dark-2))',
      '&[data-active]': {
        color: 'var(--mantine-color-orange-5)',
        borderColor: 'var(--mantine-color-orange-5)',
      },
      '&:hover': {
        color: 'light-dark(#343a40, var(--mantine-color-dark-0))',
      },
    },
    panel: {
      backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-6))',
    },
  },
});
EOF

# Create components/paper - FIXED VERSION
cat > theme/components/paper << 'EOF'
import { Paper } from '@mantine/core';

export const PaperComponent = Paper.extend({
  defaultProps: {
    radius: 'md',
    shadow: 'sm',
  },
  styles: {
    root: {
      backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-6))',
      border: 'light-dark(1px solid #f1f3f4, 1px solid var(--mantine-color-dark-5))',
    },
  },
});
EOF

# Create components/appShell - FIXED VERSION
cat > theme/components/appShell << 'EOF'
import { AppShell } from '@mantine/core';

export const AppShellComponent = AppShell.extend({
  styles: {
    root: {
      backgroundColor: 'light-dark(#f8f9fa, var(--mantine-color-dark-7))',
    },
    main: {
      backgroundColor: 'light-dark(#f8f9fa, var(--mantine-color-dark-7))',
    },
  },
});
EOF

# Create components/header - FIXED VERSION
cat > theme/components/header << 'EOF'
import { AppShell } from '@mantine/core';

export const AppShellHeaderComponent = AppShell.Header.extend({
  styles: {
    header: {
      backgroundColor: 'light-dark(#ffffff, var(--mantine-color-dark-6))',
      borderBottom: 'light-dark(1px solid #f1f3f4, 1px solid var(--mantine-color-dark-5))',
    },
  },
});
EOF

# Create components/index - FIXED VERSION
cat > theme/components/index << 'EOF'
export { ButtonComponent as Button } from './button';
export { CardComponent as Card } from './card';
export { ModalComponent as Modal } from './modal';
export { TextInputComponent as TextInput } from './textInput';
export { SelectComponent as Select } from './select';
export { AppShellNavbarComponent as AppShellNavbar } from './navbar';
export { NavLinkComponent as NavLink } from './navLink';
export { TableComponent as Table } from './table';
export { BadgeComponent as Badge } from './badge';
export { ActionIconComponent as ActionIcon } from './actionIcon';
export { TabsComponent as Tabs } from './tabs';
export { PaperComponent as Paper } from './paper';
export { AppShellComponent as AppShell } from './appShell';
export { AppShellHeaderComponent as AppShellHeader } from './header';
EOF

# Create main index - FIXED VERSION
cat > theme/index << 'EOF'
import { createTheme } from '@mantine/core';
import { colors } from './colors';
import { typography } from './typography';
import { spacing, radius, shadows } from './spacing';
import { cssVariablesResolver } from './globalStyles';
import { other } from './other';
import {
  Button,
  Card,
  Modal,
  TextInput,
  Select,
  AppShellNavbar,
  NavLink,
  Table,
  Badge,
  ActionIcon,
  Tabs,
  Paper,
  AppShell,
  AppShellHeader,
} from './components';

export const theme = createTheme({
  primaryColor: 'orange',
  colors,
  ...typography,
  spacing,
  radius,
  shadows,
  components: {
    Button,
    Card,
    Modal,
    TextInput,
    Select,
    AppShellNavbar,
    NavLink,
    Table,
    Badge,
    ActionIcon,
    Tabs,
    Paper,
    AppShell,
    AppShellHeader,
  },
  // CSS variables resolver for better dark mode support
  cssVariablesResolver,
  other,
  // Default to auto (follows system preference)
  defaultColorScheme: 'auto',
});

export default theme;
EOF

# Create App example - UPDATED
cat > App << 'EOF'
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from './theme';

export function App() {
  return (
    <MantineProvider theme={theme}>
      {/* Your app components */}
      {/*
      For dark mode toggle, you can use:
      import { useMantineColorScheme, Button } from '@mantine/core';

      function ThemeToggle() {
        const { colorScheme, toggleColorScheme } = useMantineColorScheme();
        return (
          <Button onClick={toggleColorScheme}>
            Toggle {colorScheme === 'dark' ? 'Light' : 'Dark'} Mode
          </Button>
        );
      }
      */}
    </MantineProvider>
  );
}

export default App;
EOF

# Create ThemeToggle example
cat > ThemeToggle << 'EOF'
import { useMantineColorScheme, Button, Group, Text } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Group>
      <Text size="sm">
        Current theme: {colorScheme}
      </Text>
      <Button
        onClick={toggleColorScheme}
        variant="outline"
        leftSection={isDark ? <IconSun size={16} /> : <IconMoon size={16} />}
      >
        Switch to {isDark ? 'Light' : 'Dark'} Mode
      </Button>
    </Group>
  );
}
EOF
