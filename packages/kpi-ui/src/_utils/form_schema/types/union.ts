import { MayBe, Schema } from './schema'

export type UnionInput = readonly [Schema, Schema, ...Schema[]]
export type UnionOutput<T extends MayBe<UnionInput>> = NonNullable<T>[number]['_Out']
