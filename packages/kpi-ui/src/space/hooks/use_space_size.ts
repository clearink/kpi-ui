import { useMemo } from 'react'
import { SPACE_SIZE } from '@shard/constant'
import { SpaceProps } from '../props'

export default function useSpaceSize(size: SpaceProps['size'], hasSplit: boolean) {
  return useMemo(() => {
    const sizes = Array.isArray(size) ? size : ([size, size] as const)
    const denominator = hasSplit ? 2 : 1
    return sizes.map((item) => {
      if (typeof item === 'string') return (SPACE_SIZE[item] || 0) / denominator
      return (item || 0) / denominator
    }) as [number, number]
  }, [size, hasSplit])
}
