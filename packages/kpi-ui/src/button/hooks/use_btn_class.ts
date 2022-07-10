import { useMemo } from 'react'
import cls from 'classnames'
import { ButtonProps } from '../props'

export default function useBtnClass(name: string, props: ButtonProps) {
  const { className, type, block, danger, shape, size, ghost, loading } = props
  return useMemo(
    () =>
      cls(name, className, {
        [`${name}--${type}`]: type,
        [`${name}--block`]: block,
        [`${name}--danger`]: danger,
        [`${name}--circle`]: shape === 'circle',
        [`${name}--round`]: shape === 'round',
        [`${name}--lg`]: size === 'large',
        [`${name}--sm`]: size === 'small',
        [`${name}--ghost`]: ghost,
        [`${name}--loading`]: loading,
      }),
    [name, className, type, block, danger, shape, size, ghost, loading]
  )
}
