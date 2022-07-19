export type RuleMessage = string | { message: string }
export type SchemaRule<T extends unknown = unknown> = (
  value: T,
) => boolean | Promise<boolean>
