import { useConstant } from '@kpi/shared'
import { motionValue } from '../motion'

export default function useMotionValue<V>(initial: V) {
  return useConstant(() => motionValue(initial))
}
