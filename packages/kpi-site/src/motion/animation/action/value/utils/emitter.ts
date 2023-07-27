import { capitalize } from '@kpi/shared'

import type { MotionValue } from '../../../../motion'
import type { MotionEventCallbacks } from '../../../../motion/interface'
import type { AnimatableValue, AnimateValueOptions } from '../../../interface'

export type Emitter = (type: keyof MotionEventCallbacks, ...params: any[]) => void

export default function createTweenEmitter<V extends AnimatableValue>(
  motion: MotionValue<V>,
  options: AnimateValueOptions<V>
): Emitter {
  return (type: keyof MotionEventCallbacks<V>) => {
    const camelCase = `on${capitalize(type)}`

    const args: [V] | [] = type === 'update' ? [motion.get()] : []

    options[camelCase] && options[camelCase](...args)

    motion.notify(type, ...args)
  }
}
