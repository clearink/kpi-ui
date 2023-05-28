/* eslint-disable import/prefer-default-export */

import { isNull } from '@kpi/shared'
import units from '../../config/units'
import { AnimatableValue } from '../interface'
import getUnit from '../../parse/utils/get_unit'

export const convertTargetUnit = <V extends AnimatableValue>(
  element: Element,
  property: string,
  targets: V[]
) => {
  const unit = units[property] || 'px'

  const withUnitTargets = targets.map((item) => {
    return isNull(getUnit(item)) ? `${item}${unit}` : item
  })

  const target = withUnitTargets[withUnitTargets.length - 1]
}
