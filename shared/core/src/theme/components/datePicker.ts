// @ts-ignore - @mantine/dates is an optional peer (base theme compat); unused by DIGITALNOTES apps
import { DatePickerInput, DateInput, TimePicker } from '@mantine/dates'

import { controlDefaultProps, inputLabelStyles } from '#/theme'

const styles = {
   defaultProps: controlDefaultProps,
   styles: {
      label: inputLabelStyles,
   },
}

export const DatePickerInputComponent = DatePickerInput.extend(styles)
export const DateInputComponent = DateInput.extend(styles)
export const TimePickerComponent = TimePicker.extend(styles)
