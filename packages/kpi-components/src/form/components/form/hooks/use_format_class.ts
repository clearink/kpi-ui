import cls from 'classnames'

import type { FormProps } from '../props'

export default function useFormatClass(
  prefixCls: string,
  props: FormProps,
  fallbacks: Pick<FormProps, 'size' | 'disabled' | 'colon' | 'requiredMark'>
) {
  const { layout, className } = props
  const { size, requiredMark } = fallbacks

  return cls(prefixCls, {
    [`${prefixCls}--${layout}`]: layout,
    [`${prefixCls}--hide-required-mark`]: !requiredMark,
    [`${prefixCls}--${size}`]: size,
    [className!]: className,
  })
}
