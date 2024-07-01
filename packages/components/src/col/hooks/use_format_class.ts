import { BREAKPOINT_NAME } from '_shared/hooks/use-breakpoint/breakpoint'
import { cls, isObject, isUndefined } from '@kpi-ui/utils'
import { useMemo } from 'react'

import type { ColProps } from '../props'

export default function useFormatClass(prefixCls: string, props: ColProps) {
  const { className, span, offset, pull, push, order } = props

  return useMemo(() => {
    const extraClass = BREAKPOINT_NAME.reduce((res, size) => {
      const breakpoint = props[size]

      if (isUndefined(breakpoint)) return res

      if (isObject(breakpoint)) {
        res[`${prefixCls}-${size}-${breakpoint.span}`] = breakpoint.span
        res[`${prefixCls}-${size}-${breakpoint.offset}`] = breakpoint.offset
        res[`${prefixCls}-${size}-${breakpoint.pull}`] = breakpoint.pull
        res[`${prefixCls}-${size}-${breakpoint.push}`] = breakpoint.push
        res[`${prefixCls}-${size}-${breakpoint.order}`] = breakpoint.order
        return res
      }

      res[`${prefixCls}-${size}-${breakpoint}`] = breakpoint

      return res
    }, {})

    return cls(
      prefixCls,
      extraClass,
      {
        [`${prefixCls}-${span}`]: !isUndefined(span),
        [`${prefixCls}-offset-${offset}`]: offset,
        [`${prefixCls}-pull-${pull}`]: pull,
        [`${prefixCls}-push-${push}`]: push,
        [`${prefixCls}-order-${order}`]: order,
      },
      className
    )
  }, [className, offset, order, prefixCls, props, pull, push, span])
}
