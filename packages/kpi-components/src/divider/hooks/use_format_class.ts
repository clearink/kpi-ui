// utils
import { cls } from '@kpi-ui/utils'
import { isUndefined } from '@kpi-ui/utils'
// types
import type { DividerProps } from '../props'

export default function useFormatClass(prefixCls: string, props: DividerProps) {
  const { direction, dashed, align, children, plain, className, margin } = props

  return cls(
    prefixCls,
    {
      [`${prefixCls}--${direction}`]: direction,
      [`${prefixCls}--dashed`]: dashed,
      [`${prefixCls}--plain`]: plain,
      [`${prefixCls}--with-text`]: children,
      [`${prefixCls}--align-${align}`]: align,
      [`${prefixCls}--custom-margin`]:
        (align === 'left' || align === 'right') && !isUndefined(margin),
    },
    className
  )
}
