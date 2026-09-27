import { Input } from '@mantine/core'

import { inputLabelStyles } from '../tokens'

const styles = {
   styles: {
      label: inputLabelStyles,
   },
}

export const InputWrapperComponent = Input.Wrapper.extend(styles)
