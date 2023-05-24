import parseFunctionString from '../utils/parse_function_string'

import type { ResolvedTransform } from '../interface'

const matrix2d = /^matrix\(/

export default {
  test: (v: string) => matrix2d.test(v),
  parse: (v: string) => {
    const parsed = parseFunctionString(v)

    if (!parsed) return {}

    const { args } = parsed

    return {
      translate: [`${args[4]}px`, `${args[5]}px`],
      scale: [args[0], args[3]],
      rotate: [],
      skew: [],
      perspective: [],
    }
  },
}
