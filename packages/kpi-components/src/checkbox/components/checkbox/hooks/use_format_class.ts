import cls from 'classnames'

import type { CheckboxProps } from '../props'

export default function useFormatClass(
  prefixCls: string,
  props: CheckboxProps,
  fallbacks: Pick<CheckboxProps, 'checked'>
) {
  const { className, indeterminate } = props
  const { checked } = fallbacks

  return cls(prefixCls, {
    [`${prefixCls}--checked`]: checked,
    [`${prefixCls}--indeterminate`]: indeterminate,
    [className!]: className,
  })
}
