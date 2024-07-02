import { cls, isUndefined } from '@kpi-ui/utils'

import type { DividerProps } from '../props'

export default function useFormatClass(prefixCls: string, props: DividerProps) {
  const { align, children, className, dashed, direction, margin, plain } = props

  return cls(
    prefixCls,
    {
      [`${prefixCls}--${direction}`]: direction,
      [`${prefixCls}--align-${align}`]: align,
      [`${prefixCls}--custom-margin`]:
        (align === 'left' || align === 'right') && !isUndefined(margin),
      [`${prefixCls}--dashed`]: dashed,
      [`${prefixCls}--plain`]: plain,
      [`${prefixCls}--with-text`]: children,
    },
    className,
  )
}
