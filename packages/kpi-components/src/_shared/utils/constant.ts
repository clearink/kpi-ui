import { isFunction, isUndefined } from '@kpi-ui/utils'

type Key = string | number | symbol

type Value = any

type Label = string | number | undefined

type ExtraAttrs = Record<string, any>

type ConstantItem =
  | readonly [Key, Value]
  | readonly [Key, Value, Label]
  | readonly [Key, Value, Label, ExtraAttrs]

type ConstantOption<T extends readonly ConstantItem[]> = {
  key: T[number][0]
  value: T[number][1]
  label: T[number][2]
} & (T[number][3] extends undefined
  ? unknown
  : Partial<T[number][3] & Record<Key, Exclude<T[number][3], T[number][3]>>>)

type GenerateEnums<T extends readonly ConstantItem[]> = T extends readonly [infer I, ...infer U]
  ? U extends readonly ConstantItem[]
    ? GenerateEnums<U> &
        (I extends ConstantItem ? { [P in I[0]]: I[1] } & { [P in I[1]]: I[2] } : unknown)
    : unknown
  : unknown

export default class Constant<T extends readonly ConstantItem[]> {
  readonly options: ConstantOption<T>[] = []

  get: (key: T[number][0]) => ConstantOption<T>

  match(callback: (item: ConstantOption<T>) => boolean): ConstantOption<T> | undefined
  match(value: Value): ConstantOption<T> | undefined
  match(value: Value, key: T[number][0]): ConstantOption<T>
  match(): any {}

  when: (value: any, condition: T[number][0] | T[number][0][]) => boolean

  extend: <R extends object>(fn: (instance: this) => R) => this & R

  injectEnums: () => this & GenerateEnums<T>

  constructor(public readonly sequences: T) {
    const k_map = new Map<T[number][0], ConstantOption<T>>()

    const v_map = new Map<Value, ConstantOption<T>>()

    sequences.forEach((sequence) => {
      const [key, value, label, extra] = sequence

      const item: any = { key, value, label, ...extra }

      this.options.push(item)

      k_map.set(key, item)

      v_map.set(value, item)
    })

    this.get = (key): any => k_map.get(key)

    this.extend = (fn) => Object.assign(this, fn(this))

    this.match = ((value: any, key: T[number][0]) => {
      if (isFunction(value)) return this.options.find(value)

      const matched = v_map.get(value)

      return isUndefined(key) ? matched : matched || this.get(key)
    }) as any

    this.when = (value, condition) => {
      const keys = Array.isArray(condition) ? condition : [condition]

      return keys.some((key) => this.get(key).value === value)
    }

    this.injectEnums = () => {
      k_map.forEach(({ key, value, label }) => {
        const properties = { [key]: { value }, [value]: { value: label } }

        Object.defineProperties(this, properties)
      })
      return this as this & GenerateEnums<T>
    }
  }
}
