import { capitalize } from '@kpi/shared'

import type { MotionValue } from '../../../motion'
import type { MotionEventCallbacks } from '../../../motion/interface'
import type { AnimateValueOptions } from '../../interface'

export type Emitter = (type: keyof MotionEventCallbacks, ...args: any) => void

export default function makeTweenEmitter(
  motion: MotionValue,
  options: AnimateValueOptions
): Emitter {
  return (type: keyof MotionEventCallbacks, ...args: any) => {
    const camelCase = `on${capitalize(type)}`

    options[camelCase] && options[camelCase](...args)

    motion.notify(type, ...args)
  }
}
