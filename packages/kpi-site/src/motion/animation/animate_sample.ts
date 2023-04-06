import raf from '../utils/raf'

import type { Easing } from '../tween/interface'
import clamp from '../utils/clamp'

interface Tween {
  type: 'tween'
  duration?: number
  easing?: Easing | Easing[]
  // 重复次数
  repeat?: number
  // 重复类型
  repeatType?: 'loop' | 'reverse' | 'mirror'
  // 重复延迟
  repeatDeley?: number
}

export interface Transition {
  duration?: number
  type: any
}

export interface AnimationPlaybackLifecycles<V> {
  onUpdate?: (current: V) => void
  onPlay?: () => void
  onComplete?: () => void
  onRepeat?: () => void
  onStop?: () => void
}
export type AnimateOptions<V = any> = Transition & AnimationPlaybackLifecycles<V>

export default function simpleAnimate(
  target: HTMLElement,
  from: number,
  to: number,
  options: any = {}
) {
  const { duration = 300, type } = options
  let start = 0
  function tick(t: number) {
    if (!start) start = t

    const timestamp = t - start
    const elapsed = clamp(timestamp, 0, duration) / duration

    const next = from + type(elapsed) * (to - from)

    target.style.setProperty('transform', `translate3d(${next}px,0,0)`)

    return timestamp <= duration
  }

  return raf(tick)
}

// todo: animation controls
// motionValue
