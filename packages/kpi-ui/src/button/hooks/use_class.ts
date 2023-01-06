import { useMemo } from 'react'
import cls from 'classnames'
import { usePrefixCls } from '../../_internal/hooks'
import { ButtonProps } from '../props'

export default function useClass(props: ButtonProps) {
  const { className, type, block, danger, shape, size, ghost, loading } = props

  const name = usePrefixCls('button')

  return cls(name, {
    [`${name}--${type}`]: type,
    [`${name}--block`]: block,
    [`${name}--danger`]: danger,
    [`${name}--circle`]: shape === 'circle',
    [`${name}--round`]: shape === 'round',
    [`${name}--lg`]: size === 'large',
    [`${name}--sm`]: size === 'small',
    [`${name}--ghost`]: ghost,
    [`${name}--loading`]: loading,
    [className!]: className,
  })
}
