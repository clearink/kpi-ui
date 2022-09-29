export type ValidType<T> = { status: 'valid'; value: T }
export type InValidType<T> = { status: 'invalid'; message: string; value: T }

export type Message = string | ((params: any) => string)
export type RuleHandler = (value: any, context?: any) => boolean | Promise<boolean>
export type EffectHandler = (current: any, original: any, context: any) => any | Promise<any>
export type RuleReturn<T = any> = Promise<ValidType<T> | InValidType<T>>
export type MakeRuleReturn<T = any> = (value: T, context?: any) => RuleReturn<T>
