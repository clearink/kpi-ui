import { useMemo } from 'react'
import { SPACE_SIZE } from '../../_shard/constant'
import { isArray, isString } from '../../_utils'
import { SpaceProps } from '../props'

export default function useSpaceGutter(size: SpaceProps['size'], hasSplit: boolean) {
  return useMemo(() => {
    const sizes = isArray(size) ? size : [size, size]
    const denominator = hasSplit ? 2 : 1
    return sizes.map((item) => {
      const space = isString(item) ? SPACE_SIZE[item] : item
      return (space || 0) / denominator
    })
  }, [size, hasSplit])
}
