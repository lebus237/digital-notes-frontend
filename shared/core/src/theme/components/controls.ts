import {
   Autocomplete,
   Checkbox,
   CheckboxCard,
   ColorInput,
   Pagination,
   SegmentedControl,
   Switch,
} from '@mantine/core'

import { DEFAULT_RADIUS, comboboxDefaultProps, controlDefaultProps } from '../tokens'

const autocompleteDefaultProps = {
   ...controlDefaultProps,
   comboboxProps: comboboxDefaultProps,
} as const

const checkboxCardDefaultProps = {
   radius: DEFAULT_RADIUS,
} as const

export const AutocompleteComponent = Autocomplete.extend({ defaultProps: autocompleteDefaultProps })
export const CheckboxComponent = Checkbox.extend({ defaultProps: controlDefaultProps })
export const CheckboxCardComponent = CheckboxCard.extend({
   defaultProps: checkboxCardDefaultProps,
})
export const ColorInputComponent = ColorInput.extend({ defaultProps: controlDefaultProps })
export const PaginationComponent = Pagination.extend({ defaultProps: controlDefaultProps })
export const SegmentedControlComponent = SegmentedControl.extend({
   defaultProps: controlDefaultProps,
})
export const SwitchComponent = Switch.extend({ defaultProps: controlDefaultProps })
