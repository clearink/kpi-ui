export type Context = { path: (string | number)[] }

export type Message = string | ((params: any) => string)

export type ValidType<T> = { value: T }
export type InValidType<T> = { message: string; value: T }

export type RuleReturn<T = any> = ValidType<T> | InValidType<T>
export type MakeRuleReturn<T = any> = (value: T, context?: Context) => Promise<RuleReturn<T>>
export type ValidateReturn<T> = RuleReturn<T> | Promise<RuleReturn<T>>

export type EffectOptions<Prev, Next = Prev> =
  | {
      type: 'transform'
      handler: (value: Prev, context?: Context) => Next | Promise<Next>
    }
  | {
      type: 'refinement'
      handler: (value: Prev, context?: Context) => RuleReturn<Prev> | Promise<RuleReturn<Prev>>
    }
  | {
      type: 'preprocess'
      handler: (value: Prev) => Next | Promise<Next>
    }
