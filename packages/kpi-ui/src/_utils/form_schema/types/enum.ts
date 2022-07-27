export type EnumType = string | number | symbol | boolean
export type EnumInput<T extends EnumType> = Readonly<[T, ...T[]]>
