import parseFunctionString from '../utils/parse_function_string'

const matrix2d = /matrix\(([^)]+)\)/

export default {
  test: (v: string) => matrix2d.test(v),
  parse: (v: string): any => {
    const parsed = parseFunctionString(v)

    if (!parsed) return {}

    // matrix(1, 0, 0, 1, 0, 0)
    const matrix = parsed.args.map(Number)
    const x = matrix[4] || 0
    const y = matrix[5] || 0

    return {
      translate3d: [x, y, 0].map((item) => `${item}px`).join(', '),
    }
  },
}
