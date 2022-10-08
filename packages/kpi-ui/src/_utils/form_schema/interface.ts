import type SchemaContext from './context'

export interface SchemaIssue {
  message: string
  path: (string | number)[]
}

export type Message = string | ((params: any) => string)

export type ValidType<T> = { status: 'valid'; value: T }
export type InValidType<T> = { status: 'invalid'; message: string; value: T }

export type RuleReturn<T = any> = ValidType<T> | InValidType<T>
// export type MakeRuleReturn<T = any> = (value: T, context?: Context) => RuleReturn<T>
export type ValidateReturn<T> = RuleReturn<T> | Promise<RuleReturn<T>>

export interface RuleOptions<T = any> {
  rule: (value: T) => boolean
  message: Message
  params?: any
}

export type EffectOptions<Prev, Next = Prev> =
  | {
      type: 'transform'
      handler: (value: Prev, context?: SchemaContext) => Next | Promise<Next>
    }
  | {
      type: 'refinement'
      handler: (
        value: Prev,
        context?: SchemaContext
      ) => RuleReturn<Prev> | Promise<RuleReturn<Prev>>
    }
  | {
      type: 'preprocess'
      handler: (value: Prev) => Next | Promise<Next>
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
