import type { CollectionQueryType } from '#/types/collection'
import { useSafeTranslate } from '#/lib/helpers/i18n-safe'
import { IconFileDescription, IconPrinter } from '@tabler/icons-react'
import { downloadDocumentFile } from '#/lib/utils'
import { DocumentFileFromExtension } from '#/types'
import { upperFirst } from 'lodash-es'
import { useState } from 'react'
import { ActionIcon, Box, Group, Loader, Menu, Select } from '@mantine/core'

export const ExportWidget = (props: {
  options: CollectionQueryType['exports']
  fileName?: string
  compact?: boolean
}) => {
  const { trans } = useSafeTranslate()
  const [loading, setLoading] = useState<boolean>(false)
  const options = props.options ?? []

  const extractDateRange = (url: string): string => {
    try {
      const urlObj = new URL(
        url,
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
      )
      const fromDate = urlObj.searchParams.get('fromDate')
      const toDate = urlObj.searchParams.get('toDate')

      if (fromDate && toDate) {
        return `${fromDate}_to_${toDate}`
      }
    } catch {
      // ignore malformed urls
    }

    return ''
  }

  const handleExport = async (link: any) => {
    if (!link) return
    const option = options.find((item) => item.url === link)
    if (!option) return

    setLoading(true)
    try {
      const dateRange = extractDateRange(link)
      const fileName = [`${upperFirst(props.fileName ?? 'List')}_${dateRange}`, option.type]
        .filter(Boolean)
        .join('.')

      await downloadDocumentFile(link, fileName, DocumentFileFromExtension[option.type])
    } finally {
      setLoading(false)
    }
  }

  if (options.length === 0) return null

  if (props.compact) {
    return (
      <Menu shadow="md" position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon
            size={36}
            disabled={loading || options.length === 0}
            aria-label={trans('placeholder.export')}
          >
            {loading ? <Loader size={18} color="gray" /> : <IconPrinter size={24} />}
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {options.map((item) => (
            <Menu.Item key={item.url} onClick={() => void handleExport(item.url)}>
              {trans(`enum.${item.type.toLowerCase()}.format`)}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    )
  }

  return (
    <Box w="100%" pos="relative">
      <Select
        leftSection={<IconFileDescription size={16} />}
        placeholder={trans('placeholder.export')}
        data={options.map((item) => ({
          label: trans(`enum.${item.type.toLowerCase()}.format`),
          value: item.url,
        }))}
        onChange={(value) => void handleExport(value)}
      />
      {loading && (
        <Box pos="absolute" top={-1} right={0} w="100%" h={45} bg="white" opacity={0.9}>
          <Group justify="end" w="100%" p="sm">
            <Loader size={18} color="gray" />
          </Group>
        </Box>
      )}
    </Box>
  )
}
