import { cls } from '@kpi-ui/utils'

import type { RowProps } from '../props'

export default function useFormatClass(prefixCls: string, props: RowProps) {
  const { className, justify, align, wrap } = props

  return cls(
    prefixCls,
    {
      [`${prefixCls}--${justify}`]: justify,
      [`${prefixCls}--${align}`]: align,
      [`${prefixCls}--wrap`]: wrap,
    },
    className
  )
}
