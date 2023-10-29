import { isNumber, pick } from '@kpi/shared'
import { useMemo } from 'react'

import type { CSSTransitionProps } from '../props'

export default function useFormatTimeouts(duration: CSSTransitionProps['duration']) {
  return useMemo(() => {
    if (isNumber(duration)) return { appear: duration, enter: duration, exit: duration }

    return pick(duration ?? {}, ['appear', 'enter', 'exit'])
  }, [duration])
}
