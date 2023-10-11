import { isNumber, isUndefined } from '@kpi/shared'

import type { TransitionProps } from '../props'

export default function normalizeDuration(duration: TransitionProps['duration']) {
  if (isUndefined(duration)) return { appear: undefined, enter: undefined, exit: undefined }

  if (isNumber(duration)) return { appear: duration, enter: duration, exit: duration }

  const { appear, enter, exit } = duration

  return { appear, enter, exit }
}
