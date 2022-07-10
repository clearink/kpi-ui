import { useMemo } from 'react'
import { useBreakpoint } from '../../_hooks'
import { handleMatchPoint } from '../../_hooks/use_breakpoint/media_observer'
import { isArray, isNumber, isPlainObject } from '../../_utils'
import { RowProps } from '../props'

export default function useRowGutter(gutter: RowProps['gutter']) {
  const $gutter = useMemo(() => (isArray(gutter) ? gutter : [gutter, 0]), [gutter])
  const needMatch = useMemo(() => $gutter.some(isPlainObject), [$gutter])

  const matches = useBreakpoint(() => needMatch)

  return useMemo(() => {
    return $gutter.map((gap) => {
      if (isNumber(gap)) return gap
      return handleMatchPoint(matches, gap) ?? 0
    })
  }, [$gutter, matches])
}
