import {
  ActionIcon,
  Box,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  Pagination,
  Pill,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { IconAdjustmentsHorizontal, IconCircleDot, IconSearch } from '@tabler/icons-react'
import React, { useState } from 'react'

import { type CollectionServiceReturnType } from '#/hooks/use-collection-service'
import { useViewPort } from '#/hooks/use-view-port'
import { SafeI18nLabel, useSafeTranslate } from '#/lib/helpers/i18n-safe'
import { ExportWidget } from './ExportWidget'

export type AnalyticsItemType = {
  label: string
  key: string
  parseValue?: (value?: string | number) => string | any
  icon?: any
  color?: any
}

export type ToolSizes = {
  searchSize: number
  size?: number
  container?: number
  customFilter?: number
}

export type HidePlugins = {
  search?: boolean
  pagination?: boolean
  filters?: boolean
  order?: boolean
  range?: boolean
  export?: boolean
}

export type CollectionDisplayBaseProps = {
  controller?: CollectionServiceReturnType
  analytics?: AnalyticsItemType[]
  marginBottom?: string
  toolSizes?: ToolSizes
  toolbarExtra?: React.ReactNode
  hidePlugins?: HidePlugins
  collectionExportName?: string
}

function AnalyticsCard({
  title,
  value,
  icon,
}: {
  title: string
  value?: number | string
  icon?: React.ReactNode
  color?: any
}) {
  return (
    <Card radius="md" shadow="xs">
      <Card.Section p="sm">
        <Flex justify="space-between" align="center">
          <Stack gap={2}>
            <Text size="sm" fw={600}>
              {value}
            </Text>
            <Title size="xs" fw={300} fs="italic" c="dimmed">
              {title}
            </Title>
          </Stack>
          <Box c="dimmed">{icon ?? <IconCircleDot />}</Box>
        </Flex>
      </Card.Section>
    </Card>
  )
}

function Label({ text }: { text: string | number }) {
  return <span style={{ fontSize: 'var(--mantine-font-size-sm)' }}>{String(text)}</span>
}

function SimpleDateRange({
  w,
  value,
  onChange,
}: {
  w?: string
  value: [string | null | undefined, string | null | undefined]
  onChange: (values: [string | undefined, string | undefined]) => void
}) {
  return (
    <Group gap="xs" w={w} wrap="nowrap">
      <TextInput
        type="date"
        w="100%"
        aria-label="From date"
        value={value[0] ?? ''}
        onChange={(event) => onChange([event.currentTarget.value || undefined, value[1] ?? undefined])}
      />
      <TextInput
        type="date"
        w="100%"
        aria-label="To date"
        value={value[1] ?? ''}
        onChange={(event) => onChange([value[0] ?? undefined, event.currentTarget.value || undefined])}
      />
    </Group>
  )
}

function CollectionDisplay({
  marginBottom = '100px',
  hidePlugins = {},
  renderBody,
  ...props
}: CollectionDisplayBaseProps & {
  renderBody: () => React.ReactNode
}) {
  const { trans } = useSafeTranslate()
  const viewPort = useViewPort()
  const [mobileControlsOpened, setMobileControlsOpened] = useState(false)

  const activeQuery = props.controller?.query
  const activeDateRange = activeQuery?.dateRange ?? (props.controller?.meta as any)?.dateRange
  const hasToolbarControls = Boolean(
    (!hidePlugins.order && (props.controller?.meta as any)?.order) ||
      (!hidePlugins.range && activeDateRange) ||
      props.toolbarExtra,
  )

  const total = props.controller?.meta?.pagination.total ?? 0
  const currentPage = props.controller?.meta?.pagination.page ?? 1
  const limit = props.controller?.meta?.pagination.limit ?? 10
  const totalPages = Math.max(1, Math.ceil(total / limit))

  const formatValue = (value: any, item: string) => {
    const isMoney = ['amount', 'price', 'cost', 'revenue', 'total', 'fee'].some((k) =>
      item.toLowerCase().includes(k),
    )
    return isMoney
      ? Number(value ?? 0).toLocaleString('en-FR', { style: 'currency', currency: 'XAF' })
      : String(value ?? 0)
  }

  const handleFilterChange = (value: string) => {
    const newFilter = activeQuery?.filter === value ? null : value
    props.controller?.onChangeFilter(newFilter ?? '')
  }

  React.useEffect(() => {
    if (!viewPort.isMobile) setMobileControlsOpened(false)
  }, [viewPort.isMobile])

  const renderToolbarControls = (mobile = false) => {
    const inlineDropdownProps = mobile
      ? {
          withinPortal: false,
          middlewares: { flip: false, shift: false },
          floatingStrategy: 'absolute' as const,
        }
      : undefined
    const mobileInputStyles = mobile ? { fontSize: 16 } : undefined

    const orderControl =
      (props.controller?.meta as any)?.order && !hidePlugins.order ? (
        <Select
          w="100%"
          m={0}
          styles={{
            input: {
              padding: 'var(--mantine-spacing-xs)',
              ...mobileInputStyles,
            },
          }}
          value={activeQuery?.order || null}
          onChange={(value) => props.controller?.onChangeOrder(value ?? '')}
          data={(((props.controller?.meta as any)?.order as unknown as string[]) ?? []).map((item) => ({
            label: trans(`text.${item}`),
            value: item,
          }))}
          comboboxProps={inlineDropdownProps}
        />
      ) : null

    const dateRangeControl =
      !hidePlugins.range && activeDateRange ? (
        <SimpleDateRange
          w="100%"
          value={[activeDateRange?.fromDate, activeDateRange?.toDate]}
          onChange={(values) =>
            props.controller?.onDateChange(values[0] ?? undefined, values[1] ?? undefined)
          }
        />
      ) : null

    const exportControl =
      !hidePlugins.export && (props.controller?.meta as any)?.exports ? (
        <ExportWidget
          options={(props.controller?.meta as any).exports}
          fileName={props.collectionExportName}
        />
      ) : null

    if (mobile) {
      return (
        <Stack gap="sm" w="100%" p="md">
          {orderControl}
          {dateRangeControl}
          {props.toolbarExtra && <Box w="100%">{props.toolbarExtra}</Box>}
        </Stack>
      )
    }

    return (
      <Grid justify="end">
        {orderControl && (
          <Grid.Col span={{ base: 6, md: props.toolSizes?.size ?? 3 }} my="xs">
            {orderControl}
          </Grid.Col>
        )}
        {dateRangeControl && (
          <Grid.Col span={{ base: 6, md: props.toolSizes?.size ?? 3 }} my="xs">
            {dateRangeControl}
          </Grid.Col>
        )}
        {exportControl && (
          <Grid.Col span={{ base: 6, md: props.toolSizes?.size ?? 3 }} my="xs">
            {exportControl}
          </Grid.Col>
        )}
        {props.toolbarExtra && (
          <Grid.Col span={{ base: 6, md: props.toolSizes?.customFilter ?? 3 }} my="xs">
            {props.toolbarExtra}
          </Grid.Col>
        )}
      </Grid>
    )
  }

  const searchInput = !hidePlugins.search ? (
    <TextInput
      w="100%"
      leftSection={<IconSearch size="20px" />}
      value={activeQuery?.query ?? ''}
      onChange={(event) => props.controller?.onSearch(event.currentTarget.value)}
      placeholder={trans('text.search')}
      styles={viewPort.isMobile ? { input: { fontSize: 16 } } : undefined}
    />
  ) : null

  const mobileExportControl =
    !hidePlugins.export && (props.controller?.meta as any)?.exports ? (
      <ExportWidget
        compact
        options={(props.controller?.meta as any).exports}
        fileName={props.collectionExportName}
      />
    ) : null

  return (
    <Grid gap={0}>
      {props.controller?.analytics && (
        <Grid.Col span={12} mb="sm">
          <Grid justify="start">
            {props.analytics
              ? props.analytics.map((item, index) => (
                  <Grid.Col span={{ base: 12, sm: 3, lg: 2 }} key={index}>
                    <AnalyticsCard
                      title={trans(item.label)}
                      icon={item.icon}
                      color={item.color}
                      value={
                        item.parseValue
                          ? item.parseValue(props.controller?.analytics[item.key] ?? 0)
                          : (props.controller?.analytics[item.key] ?? 0)
                      }
                    />
                  </Grid.Col>
                ))
              : Object.keys(props.controller?.analytics).map((item: any) => (
                  <Grid.Col span={{ base: 12, sm: 3, md: 2 }} key={item}>
                    <AnalyticsCard
                      title={trans(`text.${item}`)}
                      value={formatValue(props.controller?.analytics[item], item)}
                    />
                  </Grid.Col>
                ))}
          </Grid>
        </Grid.Col>
      )}

      <Grid.Col span={12} my={0}>
        {viewPort.isMobile ? (
          <Group
            justify={searchInput ? 'space-between' : 'end'}
            align="center"
            wrap="nowrap"
            gap="xs"
          >
            {searchInput && <Box style={{ flex: 1 }}>{searchInput}</Box>}
            {mobileExportControl}
            {hasToolbarControls && (
              <ActionIcon
                variant="outline"
                size={36}
                aria-label={trans('text.filters')}
                onClick={() => setMobileControlsOpened(true)}
              >
                <IconAdjustmentsHorizontal size={20} />
              </ActionIcon>
            )}
          </Group>
        ) : (
          <Grid justify="space-between">
            {searchInput && (
              <Grid.Col
                span={{ base: 12, xs: 6, md: props.toolSizes?.searchSize ?? 3 }}
                my="xs"
              >
                {searchInput}
              </Grid.Col>
            )}

            <Grid.Col span={{ base: 12, xs: 6, md: props.toolSizes?.container ?? 9 }}>
              {renderToolbarControls()}
            </Grid.Col>
          </Grid>
        )}
      </Grid.Col>

      {viewPort.isMobile && hasToolbarControls && (
        <Modal
          opened={mobileControlsOpened}
          onClose={() => setMobileControlsOpened(false)}
          title={<SafeI18nLabel label="text.filters" />}
          centered={false}
          keepMounted
          size="100%"
          xOffset={0}
          yOffset={0}
          overlayProps={{ backgroundOpacity: 0.45, blur: 3 }}
          transitionProps={{ transition: 'slide-up', duration: 220 }}
          styles={{
            inner: { alignItems: 'flex-end', padding: 0 },
            content: {
              width: '100%',
              maxWidth: '100%',
              height: '40vh',
              maxHeight: '60vh',
              borderRadius: 'var(--mantine-radius-md) var(--mantine-radius-md) 0 0',
            },
            body: { height: 'calc(60vh - 70px)', overflowY: 'auto', padding: 0 },
          }}
        >
          <Divider w="100%" variant="dashed" />
          {renderToolbarControls(true)}
        </Modal>
      )}

      {(props.controller?.meta as any)?.filter && !hidePlugins.filters && (
        <Grid.Col span={12} mt="sm">
          <ScrollArea type="auto" scrollbarSize={4} offsetScrollbars w="100%">
            <Group gap="xs" wrap="nowrap">
              {(((props.controller?.meta as any)?.filter as unknown as string[]) ?? []).map((item) => (
                <Pill
                  key={item}
                  size="sm"
                  onClick={() => handleFilterChange(item)}
                  style={{
                    cursor: 'pointer',
                    background:
                      activeQuery?.filter === item
                        ? 'light-dark(var(--mantine-color-default-6), var(--mantine-color-default-8))'
                        : 'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-2))',
                    color: activeQuery?.filter === item ? 'white' : 'black',
                    transition: 'all 200ms ease',
                  }}
                >
                  <SafeI18nLabel label={`text.${item}`} />
                </Pill>
              ))}
            </Group>
          </ScrollArea>
        </Grid.Col>
      )}

      <Grid.Col span={12} pos="relative" mih={120} py="sm">
        {renderBody()}
      </Grid.Col>

      {!hidePlugins.pagination && (
        <Grid.Col span={12} mb={marginBottom} mt="md">
          <Flex
            justify="space-between"
            align="center"
            w="100%"
            gap="sm"
            direction={{ base: 'column', sm: 'row' }}
          >
            <Group gap="xs">
              <Label text={total} />
              <Label text="text.elements" />
            </Group>
            <Group gap="sm" align="center" justify="center" wrap="wrap">
              <Select
                w={80}
                size="xs"
                value={String(limit)}
                onChange={(value) => {
                  if (value) props.controller?.onPaginate(1, parseInt(value))
                }}
                data={[
                  { label: '10', value: '10' },
                  { label: '20', value: '20' },
                  { label: '50', value: '50' },
                  { label: '100', value: '100' },
                ]}
                searchable={false}
              />
              <Pagination
                siblings={viewPort.isMobile ? 0 : 1}
                boundaries={viewPort.isMobile ? 1 : 2}
                value={currentPage}
                onChange={(page) => props.controller?.onPaginate(page, limit)}
                total={totalPages}
              />
            </Group>
          </Flex>
        </Grid.Col>
      )}
    </Grid>
  )
}

export default CollectionDisplay
