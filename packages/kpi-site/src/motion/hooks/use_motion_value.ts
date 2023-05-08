import { useConstant } from '@kpi/shared'
import { motionValue } from '../motion'

import type { AnimatableValue } from '../animation/interface'

export default function useMotionValue<V>(initial: V) {
  return useConstant(() => motionValue(initial as V & AnimatableValue))
}
