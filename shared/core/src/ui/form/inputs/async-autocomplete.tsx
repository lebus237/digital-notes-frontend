import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Autocomplete as MantineAutocomplete, Loader, type AutocompleteProps as MantineAutocompleteProps } from '@mantine/core'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useCollectionService } from '../../../hooks/use-collection-service'
import type { SelectOption } from './select'

export type AsyncAutocompleteOption = SelectOption

export type AsyncAutocompleteProps = Omit<
   MantineAutocompleteProps,
   'data' | 'value' | 'onChange' | 'onBlur' | 'error' | 'onOptionSubmit' | 'loading'
> & {
   fetchApi: (query: any) => Promise<any>
   cacheKey?: string
   customQuery?: any
   refetching?: any
   queryClientOptions?: Partial<UseQueryOptions<any, any>>
   limit?: number
   debounceMs?: number
   minSearchLength?: number
   parseOption?: (item: any) => AsyncAutocompleteOption | null | undefined
   value?: string | null
   onChange?: (value: string | null) => void
   onBlur?: () => void
   error?: ReactNode
}

function defaultParseOption(item: any): AsyncAutocompleteOption | null {
   const value = item?.id ?? item?.value
   if (value == null) return null

   const label = item?.name ?? item?.label ?? value
   return { value: String(value), label: String(label) }
}

export function AsyncAutocomplete({
   fetchApi,
   cacheKey,
   customQuery,
   refetching,
   queryClientOptions,
   limit = 20,
   debounceMs = 300,
   minSearchLength = 0,
   parseOption,
   value,
   onChange,
   onBlur,
   error,
   ...props
}: AsyncAutocompleteProps) {
   const [inputValue, setInputValue] = useState('')
   const [searchValue, setSearchValue] = useState('')
   const [selectedOption, setSelectedOption] = useState<AsyncAutocompleteOption | null>(null)
   const isEditing = useRef(false)
   const pendingSelectionLabel = useRef<string | null>(null)
   const collection = useCollectionService(
      fetchApi,
      { pagination: { page: 1, limit } },
      cacheKey,
      customQuery,
      refetching,
      queryClientOptions,
   )

   useEffect(() => {
      const timeout = window.setTimeout(() => {
         const query = searchValue.trim()
         collection.onSearch(query.length >= minSearchLength ? query : '')
      }, debounceMs)

      return () => window.clearTimeout(timeout)
   }, [collection.onSearch, debounceMs, minSearchLength, searchValue])

   const data = useMemo(
      () => collection.data.flatMap((item) => {
         const option = parseOption ? parseOption(item) : defaultParseOption(item)
         return option ? [option] : []
      }),
      [collection.data, parseOption],
   )

   useEffect(() => {
      if (value == null || value === '') {
         setSelectedOption(null)
         if (!isEditing.current) setInputValue('')
         return
      }

      const option = data.find((item) => item.value === value)
      if (option) {
         setSelectedOption(option)
         setInputValue(option.label)
         isEditing.current = false
      } else if (selectedOption?.value !== value && !isEditing.current) {
         setSelectedOption(null)
         setInputValue(value)
      }
   }, [data, isEditing, selectedOption?.value, value])

   return (
      <MantineAutocomplete
         {...props}
         data={data}
         value={inputValue}
         onChange={(next) => {
            setInputValue(next)
            if (pendingSelectionLabel.current === next) {
               pendingSelectionLabel.current = null
               return
            }

            setSearchValue(next)
            isEditing.current = true
            if (selectedOption?.label !== next) {
               setSelectedOption(null)
               if (value != null && value !== '') onChange?.(null)
            }
         }}
         onOptionSubmit={(optionValue) => {
            const option = data.find((item) => item.value === optionValue)
            if (!option) return

            pendingSelectionLabel.current = option.label
            setSelectedOption(option)
            setInputValue(option.label)
            setSearchValue('')
            isEditing.current = false
            onChange?.(option.value)
         }}
         onBlur={onBlur}
         error={error}
         filter={({ options }) => options}
         rightSection={collection.isFetching ? <Loader size="xs" /> : props.rightSection}
      />
   )
}
