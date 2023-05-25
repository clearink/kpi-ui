/* eslint-disable no-param-reassign */
import { isUndefined } from '@kpi/shared'
import transform from '../../parse/transform'
import { getInlineCSS } from '../../parse/utils/get_style'
import { transformProps } from '../../parse/utils/resolve_transform'

import type { ElementKeyframes } from '../interface'
import type { ResolvedTransform } from '../../parse/interface'

export function adaptorHtml() {
  return {
    render: (element: Element) => {},
  }
}

export function groupTransformKeyframes(element: Element, keyframes: ElementKeyframes) {
  const inline = getInlineCSS(element, 'transform')
  // transform 的初始值需要结合

  const r = Object.entries(keyframes).reduce((result, [key, value]) => {
    if (isUndefined(value)) return result

    const fn = transformProps[key]

    fn && fn(result, [value])

    return result
  }, {} as ResolvedTransform)

  console.log('parsed inline', transform.parse(inline || ''))
  console.log('parsed keyframes', r)
  // 只需要检查 r 中的 motion value 即可
  // parsed inline 中有而 keyframes 中没有的可以不用进行 motion
  // 再进行单位转换

  return r
}
