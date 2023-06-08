import { isNull } from '@kpi/shared'
import { pushItem } from '../../../utils/array'
import { motionValue } from '../../../motion'
import transform from '../../../parse/transform'
import { motionTransformProps } from '../../../parse/transform/misc'
import {
  resolveElementTransform,
  resolveElementStyle,
  resolveElementAttribute,
} from '../../utils/resolve'
import { convertToUnit } from '../../../parse'
import getUnit from '../../../parse/utils/get_unit'
import units from '../../../config/units'

import type { AnimateElementOptions, ElementKeyframes } from '../../interface'
import type { Renderer } from '../../engine'

export default function elementTweens(
  elements: Element[],
  keyframes: ElementKeyframes,
  options: AnimateElementOptions
): Renderer[] {
  return elements.reduce((result: any[], element) => {
    // transform 的 tween
    const transforms = resolveElementTransform(element, keyframes)
    const styles = resolveElementStyle(element, keyframes)
    const attrs = resolveElementAttribute(element, keyframes)

    // Object.entries(transform.parse(keyframes)).forEach(([key, value]) => {
    //   // 给每个属性添加默认单位
    //   const defaultValue = (motionTransformProps[key] || [])[0]
    //   const defaultUnit = units[key] || 'px'

    //   // const target: string[] = normalizeTweenTarget(defaultValue, value).map((item) => {
    //   //   return isNull(getUnit(item)) ? `${item}${defaultUnit}` : item
    //   // })

    //   const target: string[] = []

    //   const targetUnit = getUnit(target[target.length - 1]) || 'px'

    //   const converted = target.map((item) => convertToUnit(element, key, item, targetUnit))

    //   console.log(converted)

    //   const motion = motionValue(converted[0])

    //   const tween = valueTween(motion, converted, options)

    //   // result.push(tween)
    // })

    // 其它的 tween

    // const tweens = Object.entries(keyframes).reduce((tt, [key, value]) => {
    //   const target = normalizeTweenTarget<V>(0 as V, value!)
    //   // convertUnit
    //   const start = target[0]
    //   const end = target[target.length - 1]

    //   const motion = motionValue(0 as V)
    //   return pushItem(tt, valueTween(motion, target, options))
    // }, [] as Tween[])

    // const tweens = Object.keys(to).map((key) => valueTween(from[key], to[key], options))

    return result
  }, [])
}
