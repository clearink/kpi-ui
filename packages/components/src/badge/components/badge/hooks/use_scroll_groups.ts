import { isNumber } from '@kpi-ui/utils'
import { useMemo } from 'react'

import type { BadgeProps } from '../props'

export default function useScrollGroups(props: BadgeProps) {
  const { count, maxCount } = props

  return useMemo(() => {
    if (!isNumber(count)) return null

    const num = Math.min(count, maxCount!)

    const _groups = `${Math.abs(num)}`.split('').map((char, i) => ({
      key: `${i}`,
      char,
      scroll: true,
    }))

    if (num < 0) _groups.unshift({ key: '-', char: '-', scroll: false })

    if (count > maxCount!) _groups.push({ key: '+', char: '+', scroll: false })

    return _groups
  }, [count, maxCount])
}
