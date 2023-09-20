/* eslint-disable import/prefer-default-export */

import { isNull, isNumber } from '@kpi/shared'
import units from '../config/units'

import type { AnimatableValue } from '../interface'

const unitReg =
  /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)$/

export default function getUnit(value: AnimatableValue) {
  if (isNumber(value)) return null

  const match = value.match(unitReg)

  return match ? match[1] : null
}
