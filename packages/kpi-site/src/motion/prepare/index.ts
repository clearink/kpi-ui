import color from './color'
import angle from './angle'
import getUnit from './utils/get_unit'

// TODO: 重新设计整个 parse 模块

import type { ElementKeyframes } from '../animation/interface'

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
  if (angle.test(value) || color.test(value)) return value

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
