import { hasOwn, isNull, toArray } from '@kpi/shared'
import units from '../../config/units'
import { motionValue } from '../../../motion'
import { convertToUnit } from '../../../prepare'
import transform from '../../../prepare/transform'
import { motionTransformProps } from '../../../prepare/transform/misc'
import getUnit from '../../../prepare/utils/get_unit'
import { pushItem } from '../../../utils/array'
import defineHidden from '../../../utils/define_hidden'
import { $cache } from '../../../utils/symbol'
import {
  resolveElementAttribute,
  resolveElementStyle,
  resolveElementTransform,
} from '../../utils/resolve'
import createTweenRenderer from '../value/renderer'

import type { AnimateElementOptions, ElementKeyframes } from '../../interface'

export default function createElementRenderer(
  elements: Element,
  keyframes: ElementKeyframes,
  options: AnimateElementOptions
) {
  const from = motionValue(0)
  return createTweenRenderer(from, 299, { start: 0, ...options })
}
