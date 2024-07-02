import { cls } from '@kpi-ui/utils'

import type { RowProps } from '../props'

export default function useFormatClass(prefixCls: string, props: RowProps) {
  const { align, className, justify, wrap } = props

  return cls(
    prefixCls,
    {
      [`${prefixCls}--${align}`]: align,
      [`${prefixCls}--${justify}`]: justify,
      [`${prefixCls}--wrap`]: wrap,
    },
    className,
  )
}
