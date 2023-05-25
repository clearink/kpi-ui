/* eslint-disable no-param-reassign */
import { logger } from '@kpi/shared'
import parseFunctionString from '../utils/parse_function_string'
import { transformProps } from '../utils/resolve_transform'

import type { ResolvedTransform } from '../interface'

export default {
  parse: (v: string): ResolvedTransform => {
    // 解析 inline transform style 可能存在的值有
    return v.split(/(\w+\(.*?\))/g).reduce((result, item) => {
      const parsed = parseFunctionString(item)

      if (!parsed) return result

      const { name, args } = parsed

      logger(name === 'rotate3d', 'please use rotate(X|Y|Z) instead of the rotate3d function')

      const fn = transformProps[name]

      fn && fn(result, args)

      return result
    }, {})
  },
}
