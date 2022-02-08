import { useMemo } from 'react'
import cls from 'classnames'
import { ButtonProps } from '../props'
import usePrefix from '../../hooks/use_prefix'
export default function useBtnClass(props: ButtonProps) {
  const name = usePrefix('btn')
  const { type = 'default', block, danger, shape, size, ghost, loading } = props
  return useMemo(() => {
    return cls(name, {
      [`${name}-${type}`]: type !== 'default',
      [`${name}-block`]: block,
      [`${name}-danger`]: danger,
      [`${name}-circle`]: shape === 'circle',
      [`${name}-round`]: shape === 'round',
      [`${name}-lg`]: size === 'large',
      [`${name}-sm`]: size === 'small',
      [`${name}-ghost`]: ghost,
      [`${name}-loading`]: loading,
    })
  }, [name, type, block, danger, shape, size, ghost, loading])
}
