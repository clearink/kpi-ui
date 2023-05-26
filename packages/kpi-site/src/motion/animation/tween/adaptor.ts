/* eslint-disable no-param-reassign */
import { isUndefined } from '@kpi/shared'
import { transformProps } from '../../parse/transform/resolve'

import type { ElementKeyframes } from '../interface'
import type { ResolvedTransform } from '../../parse/interface'

export function adaptorHtml() {
  return {
    render: (element: Element) => {},
  }
}

export function groupTransformKeyframes(element: Element, keyframes: ElementKeyframes) {
  return Object.entries(keyframes).reduce((result, [key, value]) => {
    const setter = transformProps[key]

    if (!setter || isUndefined(value)) return result

    return setter(result, value)
  }, {} as ResolvedTransform)
}
