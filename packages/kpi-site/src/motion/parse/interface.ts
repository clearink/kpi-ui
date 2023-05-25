import type { AnimatableValue } from '../animation/interface'

export interface RGBA {
  red: number
  green: number
  blue: number
  alpha: number
}

export interface ResolvedTransform<V = AnimatableValue> {
  translate3d: [V, V, V]
  perspective: [V]
  scale3d: [V, V, V]
  rotate: [V]
  rotateX: [V]
  rotateY: [V]
  skew: [V, V]
}
