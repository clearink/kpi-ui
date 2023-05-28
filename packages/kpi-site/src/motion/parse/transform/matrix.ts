import parseFunctionString from '../utils/parse_function_string'

import type { ResolvedTransform } from '../interface'

// 解析 transform matrix 只解析 x, y, z 三个
// TODO: 使用 DOMMatrix 进行转换
export default {
  test: (v: string) => /^matrix(3d)?\(/.test(v),
  parse: (v: string): ResolvedTransform => {
    const matches = parseFunctionString(v)

    if (!matches) return {}

    const { args } = matches

    if (args.length === 6) return { translateX: args[4], translateY: args[5] }

    return { translateX: args[13], translateY: args[14], translateZ: args[15] }
  },
}
