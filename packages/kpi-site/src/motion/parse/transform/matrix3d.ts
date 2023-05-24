import parseFunctionString from '../utils/parse_function_string'

const matrix3d = /^matrix3d\(/

export default {
  test: (v: string) => matrix3d.test(v),
  parse: (v: string) => {
    const parsed = parseFunctionString(v)

    if (!parsed) return {}
  },
}
