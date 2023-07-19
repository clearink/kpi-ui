/* eslint-disable @typescript-eslint/no-unused-vars */
import type { MotionValue } from '../../../../motion'
import type { MotionEventCallbacks } from '../../../../motion/interface'
import type { AnimatableValue, AnimateValueOptions } from '../../../interface'

export type Emitter = (type: keyof MotionEventCallbacks, ...params: any[]) => void

export default function createTweenEmitter<V extends AnimatableValue>(
  motion: MotionValue<V>,
  options: AnimateValueOptions<V>
) {
  return (type: keyof MotionEventCallbacks<V>, ...params: any[]) => {
    const camelCase = type.replace(/^(.)/, (a) => `on${a.toUpperCase()}`)

    const args: [V] | [] = type === 'update' ? [motion.get()] : []

    options[camelCase] && options[camelCase](...args)

    motion.notify(type, ...args)
  }
}
