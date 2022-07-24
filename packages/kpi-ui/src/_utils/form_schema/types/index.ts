import { Schema } from './schema'
export type ObjectShape = Record<string, Schema>

export type TypeChecker<T> = (value: any) => value is NonNullable<T>
export type Rule = (value: any) => boolean | Promise<boolean>
export type Message = string | { message: string }
export type MayBe<T> = T | null | undefined
export type NonUndefined<T> = T extends undefined ? never : T

export type EffectType = 'required' | 'nullable'
export type AnyObject = Record<string, any>

// object
export type OptionalSchema<T extends ObjectShape> = {
  [K in keyof T]: undefined extends T[K]['_In'] ? K : never
}[keyof T]

export type RequiredSchema<T extends ObjectShape> = Exclude<keyof T, OptionalSchema<T>>

export type FullType<T> = T extends {} ? { [K in keyof T]: T[K] } : T

export type FilterSchema<T extends ObjectShape> = FullType<{
  [K in keyof T]: T[K] extends Schema ? T[K] : never
}>
// group
export type GroupPartial<T extends ObjectShape> = {
  [P in OptionalSchema<T>]?: NonUndefined<T[P]['_Out']>
} & {
  [P in RequiredSchema<T>]: NonUndefined<T[P]['_Out']>
}

export type MakePartial<T extends MayBe<ObjectShape>> = T extends AnyObject
  ? FullType<GroupPartial<T>>
  : T

// array
export type ArrayInner<T> = T extends Array<infer I> ? I : never
export type MakeInnerType<T extends MayBe<any[]>> = T extends Array<infer I>
  ? I extends Schema
    ? I['_Out'][]
    : T
  : T

export type TypeOf<T extends Schema> = T['_Out']
export type { TypeOf as infer }

// const App = () => {
//   const form = useForm()
//   const name = useWatch(form, 'name')
//   const schema = k.object({
//     name: k.string().min(4).max(20).required(),
//     age: k.number().min(1).max(100).required(),
//     name1: k.string().min(4).max(20),
//     other: k.or([
//       k.string().required(),
//       k.object({
//         a: k.string().required(),
//         b: k.number().required(),
//       }),
//     ]),
//   })
//   return (
//     <Form form={form}>
//       <Form.Item name="name" rules="name">
//         <Input />
//       </Form.Item>
//       <Form.Item name="age" rules="age">
//         <InputNumber />
//       </Form.Item>
//       ( showName1Field && (
//       <Form.Item name="name1" rules="name1">
//         <Input />
//       </Form.Item>
//       ))
//     </Form>
//   )
// }
