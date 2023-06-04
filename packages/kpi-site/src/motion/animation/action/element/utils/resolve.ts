import { isUndefined } from '@kpi/shared'
import transform from '../../../../parse/transform'
import { motionTransformProps } from '../../../../parse/transform/misc'

import type Tween from '../../tween'
import type { ElementKeyframes } from '../../../interface'

export function resolveTweenTransition(tweens: Tween[]) {
  return tweens.reduce((result, tween, i) => {
    return result
  }, [])
}

export function resolveElementTransform(element: Element, keyframes: ElementKeyframes) {
  return Object.entries(keyframes).reduce((resolved, [key, to]) => {
    if (!transform.test(key) || isUndefined(to)) return resolved

    // 对于下面的逻辑而言, 应该是一致的

    const [defaultValue, setter] = motionTransformProps[key]

    const targets = []

    // const unit = units[key] || 'px'
    // const converted = convertTargetUnit(element, key, targets)

    setter(resolved, to)
    return resolved
  }, {} as ElementKeyframes)
}

export function resolveElementStyle(element: Element, keyframes: ElementKeyframes) {}

export function resolveElementAttribute(element: Element, keyframes: ElementKeyframes) {}
