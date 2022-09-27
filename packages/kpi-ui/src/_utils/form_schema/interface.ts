export type ValidType<T> = { status: 'valid'; value: T }
export type InValidType = { status: 'invalid'; message?: string }
export type ValidateResult<T> = ValidType<T> | InValidType | Promise<ValidType<T> | InValidType>

export type Message = string | { message: string } | ((params: any) => string)
export type RuleHandler = (value: any, context?: any) => boolean | Promise<boolean>
export type EffectHandler = (current: any, original: any, context: any) => any | Promise<any>
export type ValidateReturn<T> = (value: T, context?: any) => Promise<ValidateResult<T>>
