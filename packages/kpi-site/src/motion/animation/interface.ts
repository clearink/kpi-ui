import type { TweenController } from './scheduler'
import type { ElementOrSelector } from './utils/selector'

export type AnimatableValue = string | number

export type GenericKeyframes<V> = (V | null)[]

export type KeyframeTarget = AnimatableValue | GenericKeyframes<AnimatableValue>

export interface AnimationScope<T = any> {
  readonly current: T
  controllers: TweenController[]
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

export interface Repeat {
  repeat?: number
  repeatType?: 'loop' | 'reverse' | 'mirror'
  repeatDelay?: number
}

export type EasingFunction = (x: number) => number
export interface Transition {
  easing?: EasingFunction | EasingFunction[]
  /**
   * @description keyframes 持续时间占比 [0, 1] 之间
   */
  times?: number[]
  /**
   * @description 延迟时间(由于底层使用 raf 所以实际效果并不一定准确)
   * @default 0
   */
  delay?: number // 还可以传一个函数
  /**
   * @description 结束延迟时间
   * @default 0
   */
  endDelay?: number
  /**
   * @description 持续时间(毫秒)
   * @default 300
   */
  duration?: number
  /**
   * @description 是否自动执行
   * @default true
   */
  autoplay?: boolean
}

export interface TweenLifeCycles<V = any> {
  onStart?: VoidFunction
  onUpdate?: (current: V) => void
  onPause?: VoidFunction
  onRepeat?: VoidFunction
  onCancel?: VoidFunction
  onStop?: VoidFunction
  onComplete?: VoidFunction
}

export type AnimateValueOptions<V = any> = Transition & TweenLifeCycles<V> & Repeat

export type TransitionMap = { [key: string]: AnimateValueOptions }

export type AnimateElementOptions = AnimateValueOptions | (AnimateValueOptions & TransitionMap)

export type AnimateSequenceOptions = AnimateValueOptions & {
  default?: AnimateValueOptions
}

export type TweenOptions = AnimateValueOptions & {
  start?: number
}

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

export type DOMKeyframesSegment =
  | [ElementOrSelector, ElementKeyframes]
  | [ElementOrSelector, ElementKeyframes, AnimateValueOptions & At]

export type SequenceLabelSegment =
  | string
  | {
      name: string
      at?: SequenceTime
    }

export type AnimationSequence = (DOMKeyframesSegment | SequenceLabelSegment)[]

export type AnimationStatus = 'running' | 'paused' | 'canceled' | 'finished'
