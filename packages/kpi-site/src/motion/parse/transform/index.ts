import common from './common'
import matrix2d from './matrix2d'
import matrix3d from './matrix3d'

import type { ResolvedTransform } from '../interface'

const transformProps = Object.freeze({
  p: (value: string) => ({ type: 'perspective', value, index: 0 }),
  x: (value: string) => ({ type: 'translate3d', value, index: 0 }),
  y: (value: string) => ({ type: 'translate3d', value, index: 1 }),
  z: (value: string) => ({ type: 'translate3d', value, index: 2 }),
  translateX: (value: string) => ({ type: 'translate3d', value, index: 0 }),
  translateY: (value: string) => ({ type: 'translate3d', value, index: 1 }),
  translateZ: (value: string) => ({ type: 'translate3d', value, index: 2 }),
  scale: (value: string) => ({ type: 'scale3d', value, index: 0 }),
  scaleX: (value: string) => ({ type: 'scale3d', value, index: 0 }),
  scaleY: (value: string) => ({ type: 'scale3d', value, index: 1 }),
  scaleZ: (value: string) => ({ type: 'scale3d', value, index: 2 }),
  rotate: (value: string) => ({ type: 'rotate3d', value, index: 0 }),
  rotateX: (value: string) => ({ type: 'rotate3d', value, index: 0 }),
  rotateY: (value: string) => ({ type: 'rotate3d', value, index: 1 }),
  rotateZ: (value: string) => ({ type: 'rotate3d', value, index: 2 }),
  skew: (value: string) => ({ type: 'skew', value, index: 0 }),
  skewX: (value: string) => ({ type: 'skew', value, index: 0 }),
  skewY: (value: string) => ({ type: 'skew', value, index: 1 }),
})

export const transformPropsList = Object.keys(transformProps) as (keyof typeof transformProps)[]

// 直接解析 matrix
export default {
  test: (key: string) => !!transformProps[key],
  parse: (v: string) => {
    if (matrix3d.test(v)) return matrix3d.parse(v)
    if (matrix2d.test(v)) return matrix2d.parse(v)
    return common.parse(v)
  },
  transform: (v: ResolvedTransform) => {
    return Object.entries(v)
      .map(([fn, args]) => `${fn}(${args.join(',')})`)
      .join(' ')
  },
}
