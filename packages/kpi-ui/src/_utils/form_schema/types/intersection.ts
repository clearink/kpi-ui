import { FullType, Schema } from './schema'

export type IntersectionInput = readonly [Schema, Schema, ...Schema[]]
export type IntersectionOutput<T extends Schema[]> = FullType<
  T extends [infer I, ...infer RI]
    ? I extends Schema
      ? I['_Out'] & (RI extends [Schema, ...Schema[]] ? IntersectionOutput<RI> : unknown)
      : never
    : never
>
