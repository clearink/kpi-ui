import { cls, isUndefined } from '@kpi-ui/utils'

import type { SpaceProps } from '../props'

export default function useFormatClass(prefixCls: string, props: SpaceProps) {
  const { className, direction, align: _align, wrap } = props

  const align = direction === 'horizontal' && isUndefined(_align) ? 'center' : _align

  return cls(
    prefixCls,
    {
      [`${prefixCls}--${direction}`]: direction && direction !== 'horizontal',
      [`${prefixCls}--align-${align}`]: align,
      [`${prefixCls}--wrap`]: wrap,
    },
    className,
  )
}
