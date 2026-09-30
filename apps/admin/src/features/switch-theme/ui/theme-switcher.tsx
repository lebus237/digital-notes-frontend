import { Menu, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { IconCheck, IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react'
import styles from './theme-switcher.module.scss'

const options = [
  { value: 'light' as const, label: 'Light', icon: IconSun },
  { value: 'dark' as const, label: 'Dark', icon: IconMoon },
  { value: 'auto' as const, label: 'System', icon: IconDeviceDesktop },
]

export function ThemeSwitcher() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const computed = useComputedColorScheme('light', { getInitialValueInEffect: true })
  const TriggerIcon = computed === 'dark' ? IconMoon : IconSun

  return (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <button type="button" className={styles.trigger} aria-label="Theme">
          <TriggerIcon size={18} />
        </button>
      </Menu.Target>
      <Menu.Dropdown>
        {options.map((option) => {
          const Icon = option.icon
          const selected = colorScheme === option.value
          return (
            <Menu.Item
              key={option.value}
              leftSection={<Icon size={16} />}
              rightSection={selected ? <IconCheck size={14} /> : <span />}
              aria-checked={selected}
              role="menuitemradio"
              onClick={() => setColorScheme(option.value)}
            >
              {option.label}
            </Menu.Item>
          )
        })}
      </Menu.Dropdown>
    </Menu>
  )
}
