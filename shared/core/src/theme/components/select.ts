import { MultiSelect, Select } from '@mantine/core'

import { comboboxDefaultProps, controlDefaultProps, inputLabelStyles } from '../tokens'

// @ts-ignore
import classes from './select.module.scss'

const styles = {
   defaultProps: {
      ...controlDefaultProps,
      comboboxProps: comboboxDefaultProps,
   },
   classNames: {
      input: classes.input,
      option: classes.option,
   },
   styles: {
      label: inputLabelStyles,
      dropdown: {
         boxShadow: 'var(--mantine-shadow-lg)',
         border: 'light-dark(1px solid #dee2e6, 1px solid var(--mantine-color-dark-4))',
      },
   },
}

export const SelectComponent = Select.extend(styles)

export const MultiSelectComponent = MultiSelect.extend(styles)
