import { matchBreakpoint, useBreakpoint } from '_shared/hooks'
import { isArray, isNumber } from '@kpi-ui/utils'

import type { RowProps } from '../props'

export default function useRowGutter(gutter: NonNullable<RowProps['gutter']>) {
  const tuple = isArray(gutter) ? gutter : [gutter, 0]

  const matches = useBreakpoint((query) => {
    return tuple.some((gap) => {
      if (isNumber(gap)) return false

      const oldGap = matchBreakpoint(matches, gap)
      const newGap = matchBreakpoint(query, gap)

      return oldGap !== newGap
    })
  })

  return tuple.map((gap) => {
    if (isNumber(gap)) return gap
    return matchBreakpoint(matches, gap) ?? 0
  })
}
