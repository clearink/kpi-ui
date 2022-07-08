import { NodePath } from './interface'
import parser from './parser'
import { setValue, getValue } from './core'
import tokenizer from './tokenizer'

class FormPath {
  private cache = new Map<string, NodePath[]>()

  // 缓存路径数据
  private handleCacheInput(input: string) {
    if (!this.cache.has(input)) {
      const paths = parser(tokenizer(input))
      this.cache.set(input, paths)
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.cache.get(input)!
  }

  public set<R>(object: unknown, input: string, value: unknown): R {
    const paths = this.handleCacheInput(input)
    return setValue(object, paths, value)
  }

  public get<R>(object: unknown, input: string): R {
    const paths = this.handleCacheInput(input)
    return getValue(object, paths)[1]
  }

  public exist(object: unknown, input: string) {
    const paths = this.handleCacheInput(input)
    return getValue(object, paths)[0]
  }
}
export default new FormPath()
