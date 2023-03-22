import { easeInToEaseInOut, easeInToEaseOut } from './modifiers'

import type { EasingFunction } from '../interface'

export default function generateEasings<N extends string>(name: N, easeIn: EasingFunction) {
  return {
    [`easeIn${name}`]: easeIn,
    [`easeOut${name}`]: easeInToEaseOut(easeIn),
    [`easeInOut${name}`]: easeInToEaseInOut(easeIn),
  } as {
    [K in `easeIn${N}` | `easeOut${N}` | `easeInOut${N}`]: EasingFunction
  }
}
