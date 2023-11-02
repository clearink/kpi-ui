import { useMemo } from 'react'
import { isArray, isString } from '@kpi-ui/utils'
import { SpaceProps } from '../props'
import { SPACE_SIZE } from '../../_internal/constant'

export default function useSpaceGutter(size: SpaceProps['size'], hasSplit: boolean) {
  return useMemo(() => {
    const sizes = isArray(size) ? size : ([size, size] as const)
    const denominator = hasSplit ? 2 : 1
    return sizes.map((item) => (isString(item) ? SPACE_SIZE[item] : item || 0) / denominator)
  }, [size, hasSplit])
}
