import { useMemo } from 'react'
import { useBreakpoint, handleMatchPoint } from '@hooks'
import { isArray, isNumber, isObject } from '@utils'
import { RowProps } from '../props'

export default function useRowGutter(gutter: RowProps['gutter']) {
  const $gutter = useMemo(() => (isArray(gutter) ? gutter : [gutter, 0]), [gutter])
  const needMatch = useMemo(() => $gutter.some(isObject), [$gutter])

  const matches = useBreakpoint(() => needMatch)

  return useMemo(() => {
    return $gutter.map((gap) => {
      if (isNumber(gap)) return gap
      return handleMatchPoint(matches, gap) ?? 0
    })
  }, [$gutter, matches])
}
