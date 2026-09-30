import { Card, Skeleton, Stack, Group, Box } from '@mantine/core'

export default function CardSkeleton({
  withImage = true,
  withBadges = true,
  withFooter = true,
  imageHeight = 160,
}: {
  withImage?: boolean
  withBadges?: boolean
  withFooter?: boolean
  imageHeight?: number
}) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ height: '100%' }}>
      {withImage && (
        <Card.Section>
          <Skeleton height={imageHeight} radius={0} />
        </Card.Section>
      )}

      <Stack gap="xs" mt={withImage ? 'sm' : 0}>
        <Box>
          <Skeleton height={16} width="75%" radius="sm" mb={6} />
          <Skeleton height={10} width="50%" radius="sm" />
        </Box>

        {withBadges && (
          <Group gap={4}>
            <Skeleton height={18} width={50} radius="xl" />
            <Skeleton height={18} width={70} radius="xl" />
          </Group>
        )}

        <Stack gap={4}>
          <Skeleton height={10} radius="sm" />
          <Skeleton height={10} width="85%" radius="sm" />
        </Stack>

        {withFooter && <Skeleton height={14} width="40%" radius="sm" mt="xs" />}
      </Stack>
    </Card>
  )
}
