import { useMemo } from 'react'
import { isArray } from '@kpi-ui/utils'
import { SpaceProps } from '../props'

const SPACE_SIZE = { small: 8, default: 16, large: 24 }

export default function useSpaceGutter(size: SpaceProps['size'], hasSplit: boolean) {
  return useMemo(() => {
    const sizes = isArray(size) ? size : [size, size]
    const denominator = hasSplit ? 2 : 1
    return sizes.map((s = 0) => (SPACE_SIZE[s] ?? s) / denominator) || 0
  }, [size, hasSplit])
}
