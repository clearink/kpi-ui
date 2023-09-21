import { capitalize } from '@kpi/shared'

import type { MotionEventCallbacks } from '../../../motion/interface'
import type { AnimateElementOptions } from '../../interface'

export type Emitter = (type: keyof MotionEventCallbacks, ...args: any[]) => void

export default function makeTweenEmitter(options: AnimateElementOptions): Emitter {
  return (type: keyof MotionEventCallbacks, ...args: any[]) => {
    const camelCase = `on${capitalize(type)}`

    options[camelCase] && options[camelCase](...args)
  }
}
