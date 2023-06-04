import type { MotionValue } from '../../../../motion'
import type { AnimatableValue, AnimateValueOptions } from '../../../interface'

export default function createTweenTrigger<V extends AnimatableValue>(
  motion: MotionValue<V>,
  options: AnimateValueOptions<V>
) {
  return (sliding: [number, number], current: V) => {
    if (sliding[0] <= 0 && sliding[1] >= 0) {
      motion.notify('start')
      options.onStart && options.onStart()
    }

    motion.set(current)
    motion.notify('update', current)
    options.onUpdate && options.onUpdate(current)

    if (sliding[0] <= 1 && sliding[1] >= 1) {
      motion.notify('complete')
      options.onComplete && options.onComplete()
    }
  }
}
