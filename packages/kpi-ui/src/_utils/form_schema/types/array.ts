import { MayBe, Schema } from "./schema"

// array
export type ArrayInner<T> = T extends Array<infer I> ? I : never
export type MakeInnerType<T extends MayBe<any[]>> = T extends Array<infer I>
  ? I extends Schema
    ? I['_Out'][]
    : T
  : T