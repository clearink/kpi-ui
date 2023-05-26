import { hasOwn, isUndefined } from '@kpi/shared'
import { transformProps } from './resolve'

import type { ResolvedTransform } from '../interface'
import type { ElementKeyframes } from '../../animation/interface'

export default {
  test: (key: string) => !!transformProps[key],
  parse: (keyframes: ElementKeyframes): ResolvedTransform => {
    return Object.entries(keyframes).reduce((result, [key, value]) => {
      const setter = (transformProps[key] || [])[1]

      if (!setter || isUndefined(value)) return result

      return setter(result, value)
    }, {} as ResolvedTransform)
  },
  transform: (v: ResolvedTransform) => {
    // TODO: 按照 perspective, translate3d, rotate, skew, scale 的顺序去生成数据
    const keys = Object.keys(v)

    if (!keys.length) return 'none'

    const result = keys.map((fn) => `${fn}(${v[fn]})`).join(' ')

    return hasOwn(v, 'translateZ') ? result : `${result} translateZ(0px)`
  },
}
