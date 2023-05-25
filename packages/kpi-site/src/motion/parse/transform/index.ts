import { hasOwn } from '@kpi/shared'
import common from './common'
import matrix2d from './matrix2d'
import matrix3d from './matrix3d'

export const transformProps = Object.freeze({
  p: 'perspective',
  perspective: 'perspective',
  x: 'translateX',
  y: 'translateY',
  z: 'translateZ',
  translateX: 'translateX',
  translateY: 'translateY',
  translateZ: 'translateZ',
  scale: 'scale',
  scaleX: 'scaleX',
  scaleY: 'scaleY',
  scaleZ: 'scaleZ',
  rotate: 'rotate',
  rotateX: 'rotateX',
  rotateY: 'rotateY',
  rotateZ: 'rotateZ',
  skew: 'skew',
  skewX: 'skewX',
  skewY: 'skewY',
})

export const transformPropsList = Object.keys(transformProps) as (keyof typeof transformProps)[]

export default {
  test: (key: string) => !!transformProps[key],
  parse: (v: string) => {
    if (matrix3d.test(v)) return matrix3d.parse(v)
    if (matrix2d.test(v)) return matrix2d.parse(v)
    return common.parse(v)
  },
  transform: (v: Record<string, (string | number)[]>) => {
    const result = Object.entries(v)
      .map(([fn, args]) => `${fn}(${args.join(',')})`)
      .join(' ')

    if (!result) return 'none'

    if (hasOwn(v, 'translate3d') || hasOwn(v, 'translateZ')) return result

    return `${result} translateZ(0px)`
  },
}
