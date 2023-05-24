import parseFunctionString from '../utils/parse_function_string'

import { ResolvedTransform } from '../interface'

export default {
  parse: (v: string) => {
    if (v === 'none') {
      return {}
    }
    return v.split(' ').reduce((result, item) => {
      const parsed = parseFunctionString(item)

      return !parsed ? result : { ...result, [parsed.name]: parsed.args }
    }, {} as ResolvedTransform)
  },
}
