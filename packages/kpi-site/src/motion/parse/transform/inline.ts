// import { ResolvedTransform } from '../interface'
// import parseFunctionString from '../utils/parse_function_string'
// import { inlineTransformProps } from './misc'

// TODO: parse inline transform style
// export default {
//   parse: (v: string) => {
//     return v.split(' ').reduce((result, fn) => {
//       const matches = parseFunctionString(fn)

//       if (!matches) return result

//       const { name, args } = matches

//       const setter = inlineTransformProps[name]

//       return setter ? setter(result, args) : result
//     }, {} as ResolvedTransform)
//   },
// }

export default 1
