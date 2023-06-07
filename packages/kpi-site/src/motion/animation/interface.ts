import type { Easing } from '../easing/interface'
import type { MotionValue } from '../motion'
import { PlaybackControl } from './action/tween'
import type { ElementOrSelector } from './utils/selector'

export type AnimatableValue = string | number

export type GenericKeyframes<V> = (V | null)[]

export type KeyframeTarget = AnimatableValue | GenericKeyframes<AnimatableValue>

export interface AnimationScope<T = any> {
  readonly current: T
  animations: PlaybackControl[]
}

// dom animation
export type AnimatableStyleProperty =
  | keyof Omit<CSSStyleDeclaration, 'direction' | 'transition'>
  | 'p'
  | 'x'
  | 'y'
  | 'z'
  | 'translateX'
  | 'translateY'
  | 'translateZ'
  | 'rotateX'
  | 'rotateY'
  | 'rotateZ'
  | 'scaleX'
  | 'scaleY'
  | 'scaleZ'
  | 'skew'
  | 'skewX'
  | 'skewY'

export type ElementKeyframes = Partial<Record<AnimatableStyleProperty, KeyframeTarget>>

// TODO: 根据 gsap 的position完善类型
export type SequenceTime =
  | number
  | '<'
  | '>'
  | `+${number}`
  | `-${number}`
  | `+=${number}`
  | `-=${number}`
  | `+${number}%`
  | `-${number}%`
  | `+=${number}%`
  | `-=${number}%`
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

export interface Repeat {
  repeat?: number
  repeatType?: 'loop' | 'reverse' | 'mirror'
  repeatDelay?: number
}

export interface Transition {
  easing?: Easing | Easing[]
  /**
   * @description keyframes 持续时间占比 [0, 1] 之间
   */
  times?: number[]
  /**
   * @description 延迟时间(由于底层使用 raf 所以实际效果并不一定准确)
   * @default 0
   */
  delay?: number
  duration?: number
  autoplay?: boolean
}

export interface TweenLifeCycles<V extends AnimatableValue = AnimatableValue> {
  onStart?: VoidFunction
  onUpdate?: (current: V) => void
  onPause?: VoidFunction
  onRepeat?: VoidFunction
  onCancel?: VoidFunction
  onStop?: VoidFunction
  onComplete?: VoidFunction
}

// TODO: xxxx
export type AnimateValueOptions<V extends AnimatableValue = AnimatableValue> = Transition &
  TweenLifeCycles<V> &
  Repeat
export type AnimateElementOptions = AnimateValueOptions & {
  [x: string]: AnimateValueOptions
  default: AnimateValueOptions
}

export type AnimateSequenceOptions = AnimateValueOptions & {
  default: AnimateValueOptions
}
