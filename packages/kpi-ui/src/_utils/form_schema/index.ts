import StringSchema from './schema/string'
import NumberSchema from './schema/number'
import ObjectSchema from './schema/object'

// types
export * from './types/schema'

// schemas
export const string = StringSchema.create
export const number = NumberSchema.create
export const object = ObjectSchema.create

interface Todo {
  readonly title: string
  readonly description: string
  completed: boolean
}
type Equal<T, K> = T extends K ? (K extends T ? true : false) : false
type GetReadonlyKeys<T> = keyof {
  [K in keyof T as Equal<T[K], Readonly<T[K]>> extends true ? K : never]: T[K]
}
type Keys = GetReadonlyKeys<Todo> // expected to be "title" | "description"
