import { isNumber, isUndefined } from '@kpi/shared'
import { useMemo } from 'react'

import type { CSSTransitionProps } from '../props'

export default function useFormatTimeouts(duration: CSSTransitionProps['duration']) {
  return useMemo(() => {
    if (isUndefined(duration)) return { appear: undefined, enter: undefined, exit: undefined }

    if (isNumber(duration)) return { appear: duration, enter: duration, exit: duration }

    const { appear, enter, exit } = duration

    return { appear, enter, exit }
  }, [duration])
}
