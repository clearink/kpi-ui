import { hasOwn } from '@kpi/shared'
import common from './common'
import matrix2d from './matrix2d'
import matrix3d from './matrix3d'
import { transformProps } from '../utils/resolve_transform'

import type { ResolvedTransform } from '../interface'

export default {
  test: (key: string) => !!transformProps[key],
  parse: (v: string) => {
    if (matrix3d.test(v)) return matrix3d.parse(v)
    if (matrix2d.test(v)) return matrix2d.parse(v)
    return common.parse(v)
  },
  transform: (v: ResolvedTransform) => {
    // TODO: 按照 perspective, translate3d, rotate, skew, scale 的顺序去生成数据
    const result = Object.entries(v)
      .map(([fn, args]) => `${fn}(${args.join(',')})`)
      .join(' ')

    if (!result) return 'none'

    if (hasOwn(v, 'translate3d') || hasOwn(v, 'translateZ')) return result

    return `${result} translateZ(0px)`
  },
}
