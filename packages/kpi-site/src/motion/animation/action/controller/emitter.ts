import type { AnimatableValue } from '../../interface'

export default function createTweenEmitter<V extends AnimatableValue>() {
  return (type: string, ...args: any[]) => {
    // const [one, two] = sliding
    // if (one < 0 && two >= 0) motion.notify('start')
    // motion.set(current)
    // motion.notify('update', current)
    // if (one < 1 && two >= 1) motion.notify('complete')
  }
}
