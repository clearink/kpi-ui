import { AnimatableValue } from '../interface'

export type MotionTweenType = 'value' | 'element'
export type MotionTween<V> = MotionValueTween<V> | MotionElementTween<V>

export interface MotionValueTween<V> {
  readonly type: 'value'
  readonly unit: null | string
  readonly original: [V, V]
  readonly delay: number
  readonly end: number
  start: number
  duration: number
  transform: <T extends AnimatableValue>(elapsed: number) => T
}
export interface MotionElementTween<V> extends Omit<MotionValueTween<V>, 'type'> {
  readonly type: 'element'
  readonly targets: Element[]
}
