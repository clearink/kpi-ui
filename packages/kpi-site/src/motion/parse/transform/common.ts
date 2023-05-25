/* eslint-disable no-param-reassign */
import { logger } from '@kpi/shared'
import parseFunctionString from '../utils/parse_function_string'

import type { ResolvedTransform } from '../interface'

const makeTransform = (): ResolvedTransform => ({
  translate3d: [0, 0, 0],
  perspective: [0],
  scale3d: [1, 1, 1],
  rotate: [0],
  rotateX: [0],
  rotateY: [1],
  skew: [0, 0],
})

export default {
  parse: (v: string) => {
    // 解析 inline transform style 可能存在的值有
    /**
     * perspective
     * translate
     * translateX
     * translateY
     * translateZ
     * translate3d
     * scale
     * scaleX
     * scaleY
     * scaleZ
     * scale3d
     * rotate
     * rotateX
     * rotateY
     * rotateZ
     * rotate3d (不解析)
     * skew
     * skewX
     * skewY
     */
    return v.split(/(\w+\(.*?\))/g).reduce((result, item) => {
      const parsed = parseFunctionString(item)

      if (!parsed) return result

      const { name, args } = parsed

      logger(name === 'rotate3d', 'please use rotate(X|Y|Z) instead of the rotate3d function')

      if (name === 'perspective') {
        result.perspective[0] = args[0] || 0
      } else if (name === 'translate') {
        result.translate3d[0] = args[0] || 0
        result.translate3d[1] = args[1] || 0
      } else if (name === 'translateX') {
        result.translate3d[0] = args[0] || 0
      } else if (name === 'translateY') {
        result.translate3d[1] = args[1] || 0
      } else if (name === 'translate3d') {
        result.translate3d[0] = args[0] || 0
        result.translate3d[1] = args[1] || 0
        result.translate3d[2] = args[2] || 0
      } else if (name === 'scale') {
        result.scale3d[0] = args[0] || 1
        result.scale3d[1] = args[1] || 1
      } else if (name === 'scaleX') {
        result.scale3d[0] = args[0] || 1
      } else if (name === 'scaleY') {
        result.scale3d[1] = args[1] || 1
      } else if (name === 'scaleZ') {
        result.scale3d[2] = args[2] || 1
      } else if (name === 'scale3d') {
        result.scale3d[0] = args[0] || 1
        result.scale3d[1] = args[1] || 1
        result.scale3d[2] = args[2] || 1
      } else if (name === 'rotate') {
        result.rotate[0] = args[0] || 0
      } else if (name === 'rotateX') {
        result.rotateX[0] = args[0] || 0
      } else if (name === 'rotateY') {
        result.rotateY[0] = args[0] || 0
      } else if (name === 'skew') {
        result.skew[0] = args[0] || 0
        result.skew[1] = args[1] || 0
      } else if (name === 'skewX') {
        result.skew[0] = args[0] || 0
      } else if (name === 'skewY') {
        result.skew[1] = args[1] || 0
      }

      result[parsed.name] = parsed.args

      return result
    }, makeTransform())
  },
}
