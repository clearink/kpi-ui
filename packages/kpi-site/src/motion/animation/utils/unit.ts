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

export const convertTargetUnit = <V extends AnimatableValue>(
  element: Element,
  property: string,
  targets: V[]
) => {
  const unit = units[property] || 'px'

  const withUnitTargets = targets.map((item) => (isNull(getUnit(item)) ? `${item}${unit}` : item))

  // 最终目标的 unit
  const target = withUnitTargets[withUnitTargets.length - 1]
}
