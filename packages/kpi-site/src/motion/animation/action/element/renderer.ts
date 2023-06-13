import { hasOwn, isNull, isUndefined, toArray } from '@kpi/shared'
import { motionValue } from '../../../motion'
import { convertToUnit } from '../../../prepare'
import transform from '../../../prepare/transform'
import { motionTransformProps } from '../../../prepare/transform/misc'
import getUnit from '../../../prepare/utils/get_unit'
import { pushItem } from '../../../utils/array'
import defineHidden from '../../../utils/define_hidden'
import { $cache } from '../../../utils/symbol'
import units from '../../config/units'
import {
  resolveElementAttribute,
  resolveElementStyle,
  resolveElementTransform,
} from '../../utils/resolve'
import createTweenRenderer from '../value/renderer'
import { getElementMotionCache } from './utils/cache'
import { normalizePropertyTransition } from './utils/normalize'

import type {
  AnimateElementOptions,
  ElementKeyframes,
  KeyframeTarget,
  TweenOptions,
} from '../../interface'
import type { TweenRenderer } from '../../scheduler'

export default function createElementsRenderer(
  elements: Element[],
  keyframes: ElementKeyframes,
  options: AnimateElementOptions
) {
  return elements.reduce((result: TweenRenderer[], element) => {
    Object.entries(keyframes).forEach(([property, target]) => {
      if (isUndefined(target)) return

      const transition = normalizePropertyTransition(options[property], options)

      const rendererOptions = { start: 0, ...transition }

      pushItem(result, createElementRenderer(element, property, target, rendererOptions))
    })

    return result
  }, [])
}
function createElementRenderer(
  element: Element,
  property: string,
  target: KeyframeTarget,
  options: TweenOptions
) {
  const propertiesCache = getElementMotionCache(element)
  const cacheMotionValue = propertiesCache.get(property)
  // 1. normalize Target
  // 如果已经存在 直接创建 renderer 返回
  if (cacheMotionValue) {
  }
  // const from = cacheMotionValue ? cacheMotionValue.get() : getElementProperty()

  // const from = motionValue(0)
  // ...
}
