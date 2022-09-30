export type ValidType<T> = { status: 'valid'; value: T }
export type InValidType<T> = { status: 'invalid'; message: string; value: T }

export type Message = string | ((params: any) => string)
export type RuleHandler<T = any> = (value: T, context?: any) => boolean
export type EffectHandler<Out, NewOut> = (current: Out) => NewOut | Promise<NewOut>
export type RuleReturn<T = any> = ValidType<T> | InValidType<T>
export type MakeRuleReturn<T = any> = (value: T, context?: any) => RuleReturn<T>
export type ValidateReturn<T> = RuleReturn<T> | Promise<RuleReturn<T>>

export type TransformHandler<P, N = P> = (value: P, context: any) => N
