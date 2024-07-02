export type AnyFn<R = any> = (...args: any[]) => R
export type AnyObject = Record<string, any>
export type MayBe<T> = T | null | undefined
export type Nothing = Omit<object, keyof any>
export type LiteralUnion<T, U> = (Nothing & U) | T
export type NonUndefined<T> = T extends undefined ? never : T
export type Writable<T> = { -readonly [P in keyof T]: T[P] }
export type Full<T> = T extends Nothing ? { [K in keyof T]: T[K] } : T
export type ReactRef<T> = React.MutableRefObject<T> | React.Ref<T>

// components
export interface StyledProps {
  className?: string
  style?: React.CSSProperties
}
export interface SemanticStyledProps<K extends string> extends StyledProps {
  classNames?: Partial<Record<K, string>>
  styles?: Partial<Record<K, React.CSSProperties>>
}

export interface HasChildren<S = React.ReactNode> {
  children?: S
}
