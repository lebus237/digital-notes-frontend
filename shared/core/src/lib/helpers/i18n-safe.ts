import React from 'react'

const FALLBACKS: Record<string, string> = {
  'text.search': 'Search',
  'text.filters': 'Filters',
  'text.elements': 'elements',
  'text.no.data.found': 'No data found',
  'text.no_results': 'No results',
  'placeholder.export': 'Export',
}

export function fallbackTrans(label: any): string {
  if (label === null || label === undefined) return ''
  const key = String(label)
  return FALLBACKS[key] ?? key
}

export function useSafeTranslate(): { trans: (label: any, vars?: any) => string } {
  return { trans: fallbackTrans }
}

export function SafeI18nLabel({ label }: { label: any }): React.ReactElement {
  return React.createElement(React.Fragment, null, fallbackTrans(label))
}
