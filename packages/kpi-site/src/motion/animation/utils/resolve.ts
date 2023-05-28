import { isNull, isNumber, isString, isUndefined, logger } from '@kpi/shared'
import color from '../../parse/color'
import angle from '../../parse/angle'
import transform from '../../parse/transform'
import { motionTransformProps } from '../../parse/transform/misc'
import units from '../../config/units'
import { normalizeTweenTarget } from './normalize'
import getUnit from '../../parse/utils/get_unit'
import { convertTargetUnit } from './convert'

import type {
  AnimatableValue,
  AnimationScope,
  ElementKeyframes,
  ElementOrSelector,
} from '../interface'

export function resolveElements(elements: ElementOrSelector, scope?: AnimationScope) {
  if (isString(elements)) {
    const root: Element = scope ? scope.current : document

    logger(!!scope && !root, 'Scope provided, but no element detected.')

    return root ? Array.from(root.querySelectorAll(elements)) : []
  }

  if (elements instanceof Element) return Array.from([elements])

  return Array.from(elements || [])
}

export function resolveValueTweenTarget<V extends AnimatableValue>(target: V[]) {
  return target.map((item) => {
    if (isNumber(item)) return item

    if (color.test(item)) return color.transform(color.parse(item)) as V

    if (angle.test(item)) return angle.transform(angle.parse(item)) as V

    return item
  })
}

export function resolveElementTransform(element: Element, keyframes: ElementKeyframes) {
  return Object.entries(keyframes).reduce((resolved, [key, to]) => {
    if (!transform.test(key) || isUndefined(to)) return resolved

    // 对于下面的逻辑而言, 应该是一致的

    const [defaultValue, setter] = motionTransformProps[key]

    const targets = normalizeTweenTarget(defaultValue, to)

    const unit = units[key] || 'px'
    const converted = convertTargetUnit(element, key, targets)

    setter(resolved, to)
    return resolved
  }, {} as ElementKeyframes)
}

export function resolveElementStyle(element: Element, keyframes: ElementKeyframes) {}

export function resolveElementAttribute(element: Element, keyframes: ElementKeyframes) {}
