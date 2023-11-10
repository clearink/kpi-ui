import { isUndefined } from '@kpi-ui/utils'
import cls from 'classnames'
import { useMemo } from 'react'

import type { SpaceProps } from '../props'

export default function useFormatClass(prefixCls: string, props: SpaceProps) {
  const { className, direction, align: _align, wrap } = props

  const align = useMemo(() => {
    return direction === 'horizontal' && isUndefined(_align) ? 'center' : _align
  }, [_align, direction])

  return cls(prefixCls, {
    [`${prefixCls}--${direction}`]: direction,
    [`${prefixCls}--align-${align}`]: align,
    [`${prefixCls}--wrap`]: wrap,
    [className!]: className,
  })
}
