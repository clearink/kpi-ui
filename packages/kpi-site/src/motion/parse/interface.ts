import type { AnimatableValue } from '../animation/interface'

export interface RGBA {
  red: number
  green: number
  blue: number
  alpha: number
}

export interface ResolvedTransform<V = AnimatableValue> {
  perspective?: V
  translateX?: V
  translateY?: V
  translateZ?: V
  rotate?: V
  rotateX?: V
  rotateY?: V
  rotateZ?: V
  scale?: V
  scaleX?: V
  scaleY?: V
  scaleZ?: V
  skew?: V
  skewX?: V
  skewY?: V
}

export type TransformProps<
  V extends Required<ResolvedTransform> = Required<ResolvedTransform>,
  K extends keyof V = keyof V
> = Readonly<Record<K, readonly [V[K], (resolved: V, value: V[K]) => V]>>

export type TransformPropValue = TransformProps[keyof TransformProps]
