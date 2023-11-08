import cls from 'classnames'
import { usePrefixCls } from '../../../../_shared/hooks'

import type { SizeType } from '../../../../config-provider/props'
import type { RequiredMark } from '../../../props'
import type { FormProps } from '../props'

export default function useFormatClass(
  props: FormProps,
  contextSize: SizeType,
  requiredMark?: RequiredMark
) {
  const { layout, size = contextSize, className } = props

  const name = usePrefixCls('form')

  return cls(name, {
    [`${name}--${layout}`]: layout,
    [`${name}--hide-required-mark`]: requiredMark === false,
    [`${name}--${size}`]: size,
    [className!]: className,
  })
}
