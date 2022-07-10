import { useMemo } from 'react'
import cls from 'classnames'
import { ColProps } from '../props'

export default function useColClass(name: string, props: ColProps) {
  const { className, span, offset, pull, push, order } = props
  return useMemo(
    () =>
      cls(name, className, {
        [`${name}-${span}`]: true,
        [`${name}-offset-${offset}`]: !!offset,
        [`${name}-pull-${pull}`]: !!pull,
        [`${name}-push-${push}`]: !!push,
        [`${name}-order-${order}`]: !!order,
      }),
    [name, className, span, offset, pull, push, order]
  )
}
