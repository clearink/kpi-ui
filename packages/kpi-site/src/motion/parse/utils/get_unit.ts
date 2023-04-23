import { isNumber } from '@kpi/shared'
import { AnimatableValue } from '../../animation/interface'

export default function getUnit(value: AnimatableValue) {
  if (isNumber(value)) return null

  const reg =
    /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)$/

  const match = value.match(reg)

  return match ? match[1] : null
}

//
//   const rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g; // handles exponents notation
