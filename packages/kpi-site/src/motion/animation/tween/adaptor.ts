/* eslint-disable no-param-reassign */
import { isUndefined, logger } from '@kpi/shared'
import { ResolvedTransform } from '../../parse/interface'
import transform, { transformProps } from '../../parse/transform'
import { getInlineCSS } from '../../parse/utils/get_style'

import type { ElementKeyframes, KeyframeTarget } from '../interface'

export function adaptorHtml() {
  return {
    render: (element: Element) => {},
  }
}
const makeTransform = (): ResolvedTransform<KeyframeTarget> => ({
  translate3d: [0, 0, 0],
  perspective: [0],
  scale3d: [1, 1, 1],
  rotate: [0],
  rotateX: [0],
  rotateY: [1],
  skew: [0, 0],
})

export function groupTransformKeyframes(element: Element, keyframes: ElementKeyframes) {
  const inline = getInlineCSS(element, 'transform')

  const r = Object.entries(keyframes).reduce((result, [key, value]) => {
    const prop = transformProps[key]

    if (!prop || isUndefined(value)) return result

    if (prop === 'perspective') {
      result.perspective[0] = value || 0
    } else if (prop === 'translate') {
      result.translate3d[0] = value || 0
      result.translate3d[1] = value || 0
    } else if (prop === 'translateX') {
      result.translate3d[0] = value || 0
    } else if (prop === 'translateY') {
      result.translate3d[1] = value || 0
    } else if (prop === 'translate3d') {
      result.translate3d[0] = value || 0
      result.translate3d[1] = value || 0
      result.translate3d[2] = value || 0
    } else if (prop === 'scale') {
      result.scale3d[0] = value || 1
      result.scale3d[1] = value || 1
    } else if (prop === 'scaleX') {
      result.scale3d[0] = value || 1
    } else if (prop === 'scaleY') {
      result.scale3d[1] = value || 1
    } else if (prop === 'scaleZ') {
      result.scale3d[2] = value || 1
    } else if (prop === 'scale3d') {
      result.scale3d[0] = value || 1
      result.scale3d[1] = value || 1
      result.scale3d[2] = value || 1
    } else if (prop === 'rotate') {
      result.rotate[0] = value || 0
    } else if (prop === 'rotateX') {
      result.rotateX[0] = value || 0
    } else if (prop === 'rotateY') {
      result.rotateY[0] = value || 0
    } else if (prop === 'skew') {
      result.skew[0] = value || 0
      result.skew[1] = 0
    } else if (prop === 'skewX') {
      result.skew[0] = value || 0
    } else if (prop === 'skewY') {
      result.skew[1] = value || 0
    }

    return result
  }, makeTransform())

  console.log('inline', transform.parse(inline || ''))
  console.log('rrr', r)
  return r
}
