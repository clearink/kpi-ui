import { isNumber } from '@kpi/shared'
import color from './color'
import angle from './angle'
import getUnit from './utils/get_unit'

import type { AnimatableValue, ElementKeyframes } from '../animation/interface'
import type { Tween } from '../animation/tween/interface'
import transform from './transform'
import sanitize from './utils/sanitize'

export const parseValueTweenTarget = <V extends AnimatableValue>(target: V[]) => {
  return target.map((item) => {
    if (isNumber(item)) return item
    if (color.test(item)) return color.transform(color.parse(item)) as V
    if (angle.test(item)) return angle.transform(angle.parse(item)) as V

    return item
  })
}

export const parseElementTweenTarget = (element: Element, keyframes: ElementKeyframes) => {
  return []
}

export const convertToUnit = (
  element: Element,
  property: string,
  value: string,
  target: string
) => {
  // 如果是角度值或者颜色，直接返回即可
  // TODO: 添加 cache
  if (angle.test(value)) return angle.transform(angle.parse(value))
  if (color.test(value)) return color.transform(color.parse(value))

  const current = getUnit(value) || 'px'

  const number = parseFloat(value) || 0

  if (current === target) return value

  const horizontal = /(left|right|width|margin|padding|x)/i.test(property)

  console.log(`need convert ${current} to ${target}`)

  // cache
  // if hasCache return cacheValue

  const baseline = 100

  const toPercent = target === '%'
  const toPixel = target === 'px'
  const measureProp = `offset${horizontal ? 'Width' : 'Height'}`

  const tempNode = document.createElement(element.tagName)
  const parentNode =
    element.parentNode && element.parentNode !== document ? element.parentNode : document.body

  parentNode.appendChild(tempNode)

  tempNode.style.cssText = 'border-width:0;line-height:0;position:absolute;padding:0'

  tempNode.style[horizontal ? 'width' : 'height'] = `${baseline}${toPixel ? current : target}`

  const factor = baseline / tempNode[measureProp]

  // 如何转换？ 200px => xx%?
  // parentNode.removeChild(tempNode)

  return `${factor * parseFloat(value) || 0}${target}`
}
