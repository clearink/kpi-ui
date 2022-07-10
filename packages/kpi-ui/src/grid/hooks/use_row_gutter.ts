import { useMemo } from 'react'
import { useBreakpoint } from '../../_hooks'
import { BREAKPOINT_NAME } from '../../_shard/constant'
import { hasOwn, isArray, isNumber } from '../../_utils'
import { RowProps } from '../props'

export default function useRowGutter(gutter: RowProps['gutter']) {
  const breakpoint = useBreakpoint(false)
  return useMemo(() => {
    const $gutter = isArray(gutter) ? gutter : [gutter, 0]
    return $gutter.map((gap) => {
      if (isNumber(gap)) return gap
      return BREAKPOINT_NAME.reduce((matched, point, index, _) => {
        if (matched !== false) return matched
        if (breakpoint[point] && hasOwn(gap, point)) return gap[point]!
        // 最后一项匹配不到就给个默认值
        return index === _.length - 1 ? 0 : false
      }, false as false | number) as number
    })
  }, [gutter, breakpoint])
}
