import { Card, Image, Text, Badge, Group, Stack, Box, ActionIcon, Menu } from '@mantine/core'
import { IconDotsVertical } from '@tabler/icons-react'
import React from 'react'

export type DefaultCardConfig<T> = {
  image?: (item: T) => string | undefined
  imageHeight?: number
  title: (item: T) => React.ReactNode
  subtitle?: (item: T) => React.ReactNode
  description?: (item: T) => React.ReactNode
  badges?: (item: T) => Array<{ label: string; color?: string }>
  footer?: (item: T) => React.ReactNode
  actions?: (
    item: T,
  ) => Array<{ label: string; icon?: React.ReactNode; onClick: () => void; color?: string }>
  onClick?: (item: T) => void
}

export default function DefaultCard<T>({
  item,
  config,
}: {
  item: T
  config: DefaultCardConfig<T>
}) {
  const imageSrc = config.image?.(item)
  const badges = config.badges?.(item) ?? []
  const actions = config.actions?.(item) ?? []

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      style={{
        cursor: config.onClick ? 'pointer' : undefined,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={() => config.onClick?.(item)}
    >
      {imageSrc && (
        <Card.Section>
          <Image
            src={imageSrc}
            height={config.imageHeight ?? 160}
            alt=""
            fallbackSrc="/placeholder.svg"
          />
        </Card.Section>
      )}

      <Stack gap="xs" mt={imageSrc ? 'sm' : 0} style={{ flex: 1 }}>
        <Group justify="space-between" wrap="nowrap" align="flex-start">
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text fw={600} lineClamp={1}>
              {config.title(item)}
            </Text>
            {config.subtitle && (
              <Text size="xs" c="dimmed" lineClamp={1}>
                {config.subtitle(item)}
              </Text>
            )}
          </Box>

          {actions.length > 0 && (
            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <ActionIcon variant="subtle" onClick={(e) => e.stopPropagation()}>
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {actions.map((a, i) => (
                  <Menu.Item
                    key={i}
                    leftSection={a.icon}
                    color={a.color}
                    onClick={(e) => {
                      e.stopPropagation()
                      a.onClick()
                    }}
                  >
                    {a.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>

        {badges.length > 0 && (
          <Group gap={4}>
            {badges.map((b, i) => (
              <Badge key={i} size="sm" color={b.color} variant="light">
                {b.label}
              </Badge>
            ))}
          </Group>
        )}

        {config.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {config.description(item)}
          </Text>
        )}

        {config.footer && (
          <Box mt="auto" pt="xs">
            {config.footer(item)}
          </Box>
        )}
      </Stack>
    </Card>
  )
}
