import type { Easing } from '../tween/interface'
import type { PlaybackControl } from './playback_control'

export type GenericKeyframes<V> = [null, ...V[]] | V[]

export type AnimatableValue = string | number

export type DOMKeyframesDefinition<V> = {
  x?: V | [V, V]
  y?: V | [V, V]
  z?: V | [V, V]
  [key: string]: V | [V, V] | undefined
}

export interface AnimationScope<T = any> {
  readonly current: T
  animations: PlaybackControl[]
}

export interface Transition {
  easing?: Easing
  /**
   * @description 延迟时间(由于底层使用 raf 所以实际效果并不一定准确)
   * @default 0
   */
  delay?: number
  duration?: number
  autoplay?: boolean
}

export interface AnimationPlaybackLifeCycles<V> {
  onStart?: VoidFunction
  onChange?: (current: V) => void
  onPause?: VoidFunction
  onRepeat?: VoidFunction
  onCancel?: VoidFunction
  onStop?: VoidFunction
  onComplete?: VoidFunction
}

export interface AnimationOptions<V = any> extends Transition, AnimationPlaybackLifeCycles<V> {}
export interface MergedAnimationOptions<V = any>
  extends Required<Transition>,
    AnimationPlaybackLifeCycles<V> {}
