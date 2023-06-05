import type { MotionValue } from '../../../../motion'
import type { AnimatableValue } from '../../../interface'

export default function createTweenTrigger<V extends AnimatableValue>(motion: MotionValue<V>) {
  return (sliding: [number, number], current: V) => {
    const [one, two] = sliding

    if (one < 0 && two >= 0) motion.notify('start')

    motion.set(current)
    motion.notify('update', current)

    if (one < 1 && two >= 1) motion.notify('complete')
  }
}
