import type { AnimatableValue } from '../animation/interface'

export interface RGBA {
  red: number
  green: number
  blue: number
  alpha: number
}

export interface ResolvedTransform<V = AnimatableValue> {
  perspective?: [V]
  translate3d?: [V, V, V]
  rotateX?: [V]
  rotateY?: [V]
  rotate?: [V]
  skew?: [V, V]
  scale3d?: [V, V, V]
}
