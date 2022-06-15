import getValue from './get_value'
import { NodePath } from './interface'
import parser from './parser'
import setValue from './set_value'
import tokenizer from './tokenizer'

class FormPath {
  private cache = new Map<string, NodePath[]>()

  // 缓存路径数据
  private handleCacheInput(input: string) {
    if (!this.cache.has(input)) {
      const paths = parser(tokenizer(input))
      this.cache.set(input, paths)
    }
    return this.cache.get(input)!
  }

  public set<R extends any>(object: any, input: string, value: any): R {
    const paths = this.handleCacheInput(input)
    return setValue(object, paths, value)
  }

  public get<R extends any>(object: any, input: string): R {
    const paths = this.handleCacheInput(input)
    return getValue(object, paths)[1]
  }

  public exist(object: any, input: string) {
    const paths = this.handleCacheInput(input)
    return getValue(object, paths)[0]
  }
}
export default new FormPath()
