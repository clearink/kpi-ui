import type { MotionValue } from '../motion'
import type { Easing } from '../easing/interface'
import type { ElementOrSelector } from '../utils/resolve_element'
import type { PlaybackControl } from './controller'

export type AnimatableValue = string | number

export type GenericKeyframes<V> = [null, ...V[]] | V[]

export type KeyframeTarget = AnimatableValue | AnimatableValue[] | GenericKeyframes<AnimatableValue>

// dom animation
export type AnimatableStyleProperty =
  | keyof Omit<CSSStyleDeclaration, 'direction' | 'transition'>
  | 'x'
  | 'y'
  | 'z'
  | 'rotateX'
  | 'rotateY'
  | 'rotateZ'
  | 'scaleX'
  | 'scaleY'
  | 'scaleZ'
  | 'skewX'
  | 'skewY'

export type ElementKeyframes = Partial<Record<AnimatableStyleProperty, KeyframeTarget>>

// sequence animation
export type SequenceTime = number | '<' | `+${number}` | `-${number}`
export interface At {
  at?: SequenceTime
}

export type MotionValueSegment =
  | [MotionValue, KeyframeTarget | KeyframeTarget[]]
  | [MotionValue, KeyframeTarget | KeyframeTarget[], Transition & At]

export type DOMKeyframesSegment =
  | [ElementOrSelector, ElementKeyframes]
  // TODO: replace any type
  | [ElementOrSelector, ElementKeyframes, any]

export type SequenceLabelSegment = string & {
  name: string
  at: SequenceTime
}

export type AnimationSequence = (MotionValueSegment | DOMKeyframesSegment | SequenceLabelSegment)[]
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

export interface AnimationOptions<V = AnimatableValue>
  extends Transition,
    AnimationPlaybackLifeCycles<V> {
  /**
   * @description keyframes 持续时间占比 [0, 1] 之间
   */
  times?: number[]
}

export interface TweenLifeCycles<V> {
  onStart?: VoidFunction
  onChange?: (current: V) => void
  onPause?: VoidFunction
  onRepeat?: VoidFunction
  onCancel?: VoidFunction
  onStop?: VoidFunction
  onComplete?: VoidFunction
}

// TODO: xxxx
export interface ValueTweenOptions<V> extends Transition, TweenLifeCycles<V> {}
export interface ElementTweenOptions<V> extends Transition, TweenLifeCycles<V> {}
export interface SequenceOptions extends Transition {}
