import { hasOwn, isNull, isUndefined, pushItem, toArray } from '@kpi/shared'
import { motionValue } from '../../../motion'
import { convertToUnit } from '../../../prepare'
import transform from '../../../prepare/transform'
import { motionTransformProps } from '../../../prepare/transform/misc'
import getUnit from '../../../prepare/utils/get_unit'
import { defineHidden } from '../../../utils/define'
import { $cache } from '../../../utils/symbol'
import units from '../../config/units'

import createTweenRenderer from '../value/renderer'
import { getElementMotionCache } from './utils/cache'
import { normalizePropertyTransition } from './utils/normalize'

import type {
  AnimateElementOptions,
  ElementKeyframes,
  KeyframeTarget,
  TweenOptions,
} from '../../interface'
import { TweenRenderer } from '../../scheduler'

export default function createElementsRenderer(
  elements: Element[],
  keyframes: ElementKeyframes,
  options: AnimateElementOptions
) {
  return elements.reduce((result: TweenRenderer[], element) => {
    const entries = Object.entries(keyframes)

    for (let i = 0; i < entries.length; i += 1) {
      const [property, target] = entries[i]

      if (isUndefined(target)) continue

      const transition = normalizePropertyTransition(options[property], options)

      pushItem(result, createElementRenderer(element, property, target, transition))
    }

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
    //
  }
  // const from = cacheMotionValue ? cacheMotionValue.get() : getElementProperty()

  // const from = motionValue(0)

  const emitter = () => {}
  const update = (progress: number, iterations: number) => {}
  return new TweenRenderer(emitter, update, options)
}
