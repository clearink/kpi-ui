import { useConstant } from '@kpi/shared'
import { motionValue } from '../animation-new/motion'

export default function useMotionValue<V>(initial: V) {
  return useConstant(() => motionValue(initial))
}
