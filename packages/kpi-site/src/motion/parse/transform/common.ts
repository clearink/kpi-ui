import { ResolvedTransform } from '../interface'

export default {
  parse: (v: string) => {
    return v.split(' ').reduce((result, item) => {
      const matches = item.match(/^(\w+)\([^)]*\)$/)
      if (!matches) return result
      return { ...result, [matches[1]]: matches[2].split(',').map((arg) => arg.trim()) }
    }, {} as ResolvedTransform)
  },
}
