import type { Easing } from '../tween/interface'
import type PlaybackControl from './playback_control'

export interface AnimationPlaybackControls {
  time: number
  speed: number

  /*
   * The duration is the duration of time calculated for the active part
   * of the animation without delay or repeat,
   * which may be added as an extra prop at a later date.
   */
  duration: number

  stop: () => void
  play: () => void
  pause: () => void
  complete: () => void
  cancel: () => void
  then: (onResolve: VoidFunction, onReject?: VoidFunction) => Promise<void>
}

export type GenericKeyframes<V> = [null, ...V[]] | V[]

export type AnimatableValue = string | number

export type DOMKeyframesDefinition = any

export interface AnimationScope<T = any> {
  readonly current: T
  animations: PlaybackControl[]
}

export interface Transition {
  ease?: Easing
  delay?: number
  endDelay?: number
  duration?: number
  autoplay?: boolean
}

interface AnimationPlaybackLifeCycles<V> {
  onStart?: VoidFunction
  onChange?: (current: V) => void
  onPause?: VoidFunction
  onRepeat?: VoidFunction
  onCancel?: VoidFunction
  onStop?: VoidFunction
  onFinish?: VoidFunction
}

export interface AnimationOptions<V = any> extends Transition, AnimationPlaybackLifeCycles<V> {}
