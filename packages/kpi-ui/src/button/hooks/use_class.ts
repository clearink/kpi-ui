import { useMemo } from 'react'
import cls from 'classnames'
import { ButtonProps } from '../props'
import { usePrefix } from '../../.internal/hooks'

export default function useClass(props: ButtonProps) {
  const { className, type, block, danger, shape, size, ghost, loading } = props
  const name = usePrefix('button')
  return useMemo(
    () =>
      cls(name, {
        [`${name}--${type}`]: type,
        [`${name}--block`]: block,
        [`${name}--danger`]: danger,
        [`${name}--circle`]: shape === 'circle',
        [`${name}--round`]: shape === 'round',
        [`${name}--lg`]: size === 'large',
        [`${name}--sm`]: size === 'small',
        [`${name}--ghost`]: ghost,
        [`${name}--loading`]: loading,
        [className!]: !!className,
      }),
    [name, className, type, block, danger, shape, size, ghost, loading]
  )
}
