import { MotionValue } from '../../../../motion'
import { AnimateValueOptions } from '../../../interface'

export default function createTweenTrigger(
  motion: MotionValue,
  options: AnimateValueOptions<string>
) {
  return (sliding: [number, number], current: string) => {
    if (sliding[0] <= 0 && sliding[1] >= 0) {
      motion.notify('start')
      options.onStart && options.onStart()
    }

    motion.set(current)
    motion.notify('update', current)
    options.onUpdate && options.onUpdate(current)
    // TODO: set element style

    if (sliding[0] <= 1 && sliding[1] >= 1) {
      motion.notify('complete')
      options.onComplete && options.onComplete()
    }
  }
}
