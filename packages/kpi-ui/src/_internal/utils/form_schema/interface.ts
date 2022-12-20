import type { ReactElement } from 'react'
import type { AnyObject } from '../../types'
import type SchemaContext from './context'

export type Name = string | number

export interface Context {
  path: Name[]
  issue: SchemaContext
  abortEarly?: boolean
}
export type Options = Partial<Omit<Context, 'issue'>>

export interface SchemaIssue {
  message: string | ReactElement
  path: Name[]
}

export type Message = SchemaIssue['message'] | ((params: AnyObject) => SchemaIssue['message'])

export type ValidType<T> = { status: 'valid'; value: T }
export type InValidType = { status: 'invalid' }

export type RuleReturn<T = any> = ValidType<T> | InValidType
export type MakeRuleReturn<T = any> = (value: T, context: Context) => Promise<RuleReturn<T>>
export type ValidateReturn<T> = RuleReturn<T> | Promise<RuleReturn<T>>

export type EffectOptions<Prev, Next = Prev> =
  | {
      type: 'transform'
      handler: (value: Prev) => Next | Promise<Next>
    }
  | {
      type: 'refinement'
      handler: (value: Prev, context: Context) => Promise<RuleReturn<Prev>>
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
