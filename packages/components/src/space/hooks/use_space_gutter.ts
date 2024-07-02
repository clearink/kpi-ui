import { isArray } from '@kpi-ui/utils'
import { useMemo } from 'react'

import type { SpaceProps } from '../props'

const SPACE_SIZE = { default: 16, large: 24, small: 8 }

export default function useSpaceGutter(size: SpaceProps['size'], hasSplit: boolean) {
  return useMemo(() => {
    const sizes = isArray(size) ? size : [size, size]
    const denominator = hasSplit ? 2 : 1
    return sizes.map((s = 0) => (SPACE_SIZE[s] ?? s) / denominator) || 0
  }, [size, hasSplit])
}
