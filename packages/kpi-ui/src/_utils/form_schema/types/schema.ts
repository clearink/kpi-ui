export type RuleMessage = string | { message: string }
export type SchemaRule<T extends unknown = unknown> = (
  value: T,
  message?: RuleMessage
) => boolean | Promise<boolean>
