import type SchemaContext from './context'

export type Name = number | string

export interface Context {
  abortEarly?: boolean
  issue: SchemaContext
  path: Name[]
}
export type Options = Partial<Omit<Context, 'issue'>>

export interface SchemaIssue {
  message: any
  path: Name[]
}

export type Message =
  | ((params: Record<string, any>) => SchemaIssue['message'])
  | SchemaIssue['message']

export interface ValidType<T> { status: 'valid'; value: T }
export interface InValidType { status: 'invalid' }

export type RuleReturn<T = any> = InValidType | ValidType<T>
export type MakeRuleReturn<T = any> = (value: T, context: Context) => Promise<RuleReturn<T>>
export type ValidateReturn<T> = Promise<RuleReturn<T>> | RuleReturn<T>

export type EffectOptions<Prev, Next = Prev> =
  | {
    handler: (value: Prev) => Next | Promise<Next>
    type: 'preprocess'
  }
  | {
    handler: (value: Prev) => Next | Promise<Next>
    type: 'transform'
  }
  | {
    handler: (value: Prev, context: Context) => Promise<RuleReturn<Prev>>
    type: 'refinement'
  }
  | {
    handler: (value: Prev, context: Context) => Promise<RuleReturn<Prev>>
    type: 'required'
  }
  | {
    type: 'nullable'
  }

export interface ValidateOptions {
  /**
   * 校验失败立即返回， 无需等待全部校验完毕。默认值-true
   */
  abortEarly?: boolean
  /**
   * 删除对象中未指定的key。默认值-true
   */
  stripUnknown?: boolean
}
