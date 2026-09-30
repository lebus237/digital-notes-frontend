import { Grid, Center, Text } from '@mantine/core'
import { SafeI18nLabel } from '#/lib/helpers/i18n-safe'
import CollectionDisplay, { type CollectionDisplayBaseProps } from './CollectionDisplay'
import DefaultCard, { type DefaultCardConfig } from './DefaultCard'
import CardSkeleton from './CardSkeleton'

type ColSpan = number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number }

function CollectionDisplayCard<T = any>({
  records,
  renderItem,
  cardConfig,
  cardSpan = { base: 12, sm: 6, md: 4, lg: 3 },
  gutter = 'md',
  getKey,
  emptyMessage = 'text.no_results',
  skeletonCount = 8,
  skeletonProps,
  ...base
}: CollectionDisplayBaseProps & {
  records: T[]
  renderItem?: (item: T, index: number) => React.ReactNode
  cardConfig?: DefaultCardConfig<T>
  cardSpan?: ColSpan
  gutter?: string | number
  getKey?: (item: T, index: number) => string | number
  emptyMessage?: string
  skeletonCount?: number
  skeletonProps?: React.ComponentProps<typeof CardSkeleton>
}) {
  const isLoading = base.controller?.isLoading ?? false

  const resolveItem = (item: T, index: number) => {
    if (renderItem) return renderItem(item, index)
    if (cardConfig) return <DefaultCard item={item} config={cardConfig} />
    return (
      <DefaultCard
        item={item}
        config={{ title: (i: any) => String(i?.name ?? i?.title ?? '—') }}
      />
    )
  }

  return (
    <CollectionDisplay
      {...base}
      renderBody={() => {
        if (isLoading) {
          return (
            <Grid gap={gutter}>
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <Grid.Col key={`sk-${i}`} span={cardSpan}>
                  <CardSkeleton {...skeletonProps} />
                </Grid.Col>
              ))}
            </Grid>
          )
        }

        if (records.length === 0) {
          return (
            <Center py="xl">
              <Text c="dimmed" size="sm">
                <SafeI18nLabel label={emptyMessage} />
              </Text>
            </Center>
          )
        }

        return (
          <Grid gap={gutter} justify="start">
            {records.map((item, index) => (
              <Grid.Col
                key={getKey ? getKey(item, index) : ((item as any)?.id ?? index)}
                span={cardSpan}
              >
                {resolveItem(item, index)}
              </Grid.Col>
            ))}
          </Grid>
        )
      }}
    />
  )
}

export default CollectionDisplayCard
