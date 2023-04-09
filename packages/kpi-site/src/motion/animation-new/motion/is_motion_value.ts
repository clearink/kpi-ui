import { $type, $motion } from '../../utils/symbol'

import type { MotionValue } from '.'

export default function isMotionValue<V>(obj: V | MotionValue<V>): obj is MotionValue<V> {
  return obj && obj[$type] === $motion
}
