import parseFunctionString from '../utils/parse_function_string'

const matrix3d = /^matrix3d\(/

export default {
  test: (v: string) => matrix3d.test(v),
  parse: (v: string) => {
    const parsed = parseFunctionString(v)

    if (!parsed) return {}

    const matrix = parsed.args.map(Number)
    const x = matrix[12] || 0
    const y = matrix[13] || 0
    const z = matrix[14] || 0

    return {
      translate3d: [x, y, z].map((item) => `${item}px`).join(', '),
    }
  },
}
