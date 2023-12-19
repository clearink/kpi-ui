import cls from 'classnames'

import type { CheckboxProps } from '../props'

export default function useFormatClass(
  prefixCls: string,
  props: CheckboxProps,
  fallbacks: Pick<CheckboxProps, 'checked' | 'disabled'>
) {
  const { className, indeterminate } = props
  const { checked, disabled } = fallbacks

  return cls(prefixCls, {
    [`${prefixCls}--checked`]: checked,
    [`${prefixCls}--disabled`]: disabled,
    [`${prefixCls}--indeterminate`]: indeterminate,
    [className!]: className,
  })
}
