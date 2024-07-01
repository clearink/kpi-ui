import { cls } from '@kpi-ui/utils'

import type { CheckboxProps } from '../props'

export default function useFormatClass(
  prefixCls: string,
  props: CheckboxProps,
  others: Pick<CheckboxProps, 'checked' | 'disabled'>
) {
  const { className, indeterminate } = props

  const { checked, disabled } = others

  return cls(
    prefixCls,
    {
      [`${prefixCls}--checked`]: checked,
      [`${prefixCls}--disabled`]: disabled,
      [`${prefixCls}--indeterminate`]: indeterminate,
    },
    className
  )
}
