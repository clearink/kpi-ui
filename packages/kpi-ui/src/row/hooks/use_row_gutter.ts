import { isArray, isNumber } from '@kpi/shared'
import { useBreakpoint, matchBreakpoint } from '../../_internal/hooks'

import type { RowProps } from '../props'

export default function useRowGutter(gutter: RowProps['gutter']) {
  const $gutter = isArray(gutter) ? gutter : [gutter, 0]

  const matches = useBreakpoint((query) => {
    return $gutter.some((gap) => {
      if (isNumber(gap)) return false

      const oldGap = matchBreakpoint(matches, gap)
      const newGap = matchBreakpoint(query, gap)

      return oldGap !== newGap
    })
  })

  return $gutter.map((gap) => {
    if (isNumber(gap)) return gap
    return matchBreakpoint(matches, gap) ?? 0
  })
}
