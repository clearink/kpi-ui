type Key = number | string | symbol

type Value = any

type Label = number | string | undefined

type ExtraAttrs = Record<string, any>

type ConstantItem =
  | readonly [Key, Value, Label, ExtraAttrs]
  | readonly [Key, Value, Label]
  | readonly [Key, Value]

type ConstantOption<T extends readonly ConstantItem[]> = {
  key: T[number][0]
  label: T[number][2]
  value: T[number][1]
} & (T[number][3] extends undefined
  ? unknown
  : Partial<Record<Key, Exclude<T[number][3], T[number][3]>> & T[number][3]>)

type GenerateEnums<T extends readonly ConstantItem[]> = T extends readonly [infer I, ...infer U]
  ? U extends readonly ConstantItem[]
    ? GenerateEnums<U> &
    (I extends ConstantItem ? { [P in I[0]]: I[1] } & { [P in I[1]]: I[2] } : unknown)
    : unknown
  : unknown

export default class Constant<T extends readonly ConstantItem[]> {
  readonly enums: GenerateEnums<T>

  extend: <R extends object>(fn: (instance: this) => R) => R & this

  get: (key: T[number][0]) => ConstantOption<T>

  readonly options: ConstantOption<T>[] = []
  when: (value: any, condition: T[number][0] | T[number][0][]) => boolean
  constructor(public readonly sequences: T) {
    const k_map = new Map<T[number][0], ConstantOption<T>>()

    const v_map = new Map<Value, ConstantOption<T>>()

    this.enums = {} as GenerateEnums<T>

    sequences.forEach((sequence) => {
      const [key, value, label, extra] = sequence

      const item: any = { key, label, value, ...extra }

      this.options.push(item)

      Object.defineProperties(this.enums, {
        [key]: { value },
        [value]: { enumerable: true, value: label },
      })

      k_map.set(key, item)

      v_map.set(value, item)
    })

    this.get = (key): any => k_map.get(key)

    this.extend = fn => Object.assign(this, fn(this))

    this.match = ((value: any, key: T[number][0]) => {
      if (typeof value === 'function') return this.options.find(value)

      const matched = v_map.get(value)

      return key === undefined ? matched : matched || k_map.get(key)
    }) as any

    this.when = (value, condition) => {
      const keys = Array.isArray(condition) ? condition : [condition]

      return keys.some(key => k_map.has(key) && k_map.get(key)!.value === value)
    }
  }
  match(callback: (item: ConstantOption<T>) => boolean): ConstantOption<T> | undefined

  match(value: Value): ConstantOption<T> | undefined

  match(value: Value, key: T[number][0]): ConstantOption<T>

  match(): any {}
}
