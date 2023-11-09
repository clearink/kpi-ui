import cls from 'classnames'

import type { FormItemProps } from '../props'

export default function useFormatClass(prefixCls: string, props: FormItemProps) {
  const { hidden, className } = props

  return cls(
    prefixCls,
    {
      [`${prefixCls}--hidden`]: hidden,
    },
    className
  )
}
