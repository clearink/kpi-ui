import cls from 'classnames'
import { isObject, isUndefined } from '@kpi/shared'
import { BREAKPOINT_NAME } from '../../_internal/constant'

import type { ColProps } from '../props'

export default function useClass(name: string, props: ColProps) {
  const { className, span, offset, pull, push, order } = props

  const extraClass = BREAKPOINT_NAME.reduce((res, size) => {
    const breakpoint = props[size]

    if (isUndefined(breakpoint)) return res

    if (isObject(breakpoint)) {
      res[`${name}-${size}-${breakpoint.span}`] = breakpoint.span
      res[`${name}-${size}-${breakpoint.offset}`] = breakpoint.offset
      res[`${name}-${size}-${breakpoint.pull}`] = breakpoint.pull
      res[`${name}-${size}-${breakpoint.push}`] = breakpoint.push
      res[`${name}-${size}-${breakpoint.order}`] = breakpoint.order
      return res
    }

    res[`${name}-${size}-${breakpoint}`] = breakpoint

    return res
  }, {})

  return cls(name, extraClass, {
    [`${name}-${span}`]: !isUndefined(span),
    [`${name}-offset-${offset}`]: offset,
    [`${name}-pull-${pull}`]: pull,
    [`${name}-push-${push}`]: push,
    [`${name}-order-${order}`]: order,
    [className!]: className,
  })
}
