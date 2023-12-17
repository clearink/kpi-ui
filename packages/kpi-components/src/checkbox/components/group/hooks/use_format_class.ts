import cls from 'classnames'

import type { CheckboxGroupProps } from '../props'

export default function useFormatClass(prefixCls: string, props: CheckboxGroupProps) {
  const { className } = props

  return cls(prefixCls, {
    [className!]: className,
  })
}
