import { useMemo } from 'react'
import { isArray, isString } from '@utils'
import { SPACE_SIZE } from '../assets/constant'
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
