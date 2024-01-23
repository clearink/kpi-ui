import cls from 'classnames'

import type { FormProps } from '../props'

export default function useFormatClass(prefixCls: string, props: FormProps) {
  const { layout, className, size, requiredMark } = props

  return cls(
    prefixCls,
    {
      [`${prefixCls}--${layout}`]: layout,
      [`${prefixCls}--hide-required-mark`]: !requiredMark,
      [`${prefixCls}--${size}`]: size,
    },
    className
  )
}
