import { isNullish, isNumber } from '@kpi-ui/utils'
import { useMemo } from 'react'
import { APPEAR, ENTER, EXIT } from '../../../constant'

import type { CSSTransitionProps } from '../props'

export default function useFormatTimeouts(duration: CSSTransitionProps['duration']) {
  return useMemo(() => {
    if (isNumber(duration)) return { [APPEAR]: duration, [ENTER]: duration, [EXIT]: duration }

    if (isNullish(duration)) return {}

    return { [APPEAR]: duration.appear, [ENTER]: duration.enter, [EXIT]: duration.exit }
  }, [duration])
}
