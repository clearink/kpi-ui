import cls from 'classnames'
import { usePrefixCls } from '../../_internal/hooks'
import { isNumber, isUndefined } from '../../_internal/utils'
import { BREAKPOINT_NAME } from '../../_internal/constant'
import { ColProps } from '../props'

export default function useClass(props: ColProps) {
  const { className, span, offset, pull, push, order } = props
  const name = usePrefixCls('col')
  const extraClass = BREAKPOINT_NAME.reduce((res, size) => {
    const breakpoint = props[size] ?? {}
    const config = isNumber(breakpoint) ? { span: breakpoint } : breakpoint
    return {
      [`${name}-${size}-${config.span}`]: config.span,
      [`${name}-${size}-offset-${config.offset}`]: !!config.offset,
      [`${name}-${size}-pull-${config.pull}`]: !!config.pull,
      [`${name}-${size}-push-${config.push}`]: !!config.push,
      [`${name}-${size}-order-${config.order}`]: !!config.order,
      ...res,
    }
  }, {})
  return cls(name, {
    [`${name}-${span}`]: !isUndefined(span),
    [`${name}-offset-${offset}`]: !!offset,
    [`${name}-pull-${pull}`]: !!pull,
    [`${name}-push-${push}`]: !!push,
    [`${name}-order-${order}`]: !!order,
    ...extraClass,
    [className!]: className,
  })
}
