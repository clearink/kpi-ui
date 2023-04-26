import driver from '../frame-loop'
import clamp from '../utils/clamp'
import { paused, running } from './utils/status'
import { $promise } from '../utils/symbol'

import type { MotionValue } from '../motion'
import type { MotionAnimation } from './motion_animation'
import type { AnimatableValue, AnimationPlaybackLifeCycles } from './interface'

export type PlaybackControl<V extends AnimatableValue = any> = ReturnType<typeof playbackControl<V>>

export function playbackControl<V extends AnimatableValue>(
  motion: MotionValue<V>,
  callbacks: AnimationPlaybackLifeCycles<V>,
  animations: MotionAnimation[]
) {
  const promise = motion[$promise]
  // 清除上一次的 resolve
  promise.update(true)

  const $duration = animations[animations.length - 1]?.end ?? 0

  // 是否运行动画过
  let $animated = false
  // 状态
  let $status: AnimationPlayState = 'idle'
  // 运动开始时间
  let $start = 0
  // 运动结束时间
  let $end = 0
  // 运动经过的时长
  let $time = 0

  const $update = (t: number) => {
    if (!running($status)) return false

    if (!$start) $start = t

    $animated = true

    $time = t + $end - $start

    // 获取此刻需要操作的 animations
    // TODO: 待优化
    let animation = animations.filter((ani) => $time < ani.end)[0]
    if (!animation) animation = animations[animations.length - 1]

    const { start, delay, duration } = animation

    const elapsed = clamp($time - start - delay, 0, duration)

    const current = animation.transform<V>(elapsed)

    motion.notify('change', current)

    callbacks.onChange?.(current)

    motion.set(current)

    return $time <= $duration
  }

  return {
    get time() {
      return $time
    },

    get status() {
      return $status
    },

    get animated() {
      return $animated
    },

    get speed() {
      return 1
    },

    get duration() {
      return $duration
    },

    // "finished" | "idle" | "paused" | "running"
    play: () => {
      if (running($status)) return

      $status = 'running'

      driver.start($update)
    },

    reset: () => {},

    replay: () => {},

    cancel: () => {
      $status = 'idle'
      motion.notify('cancel')
      promise.update(true)
      driver.cancel($update)
    },

    stop: () => {},

    pause: () => {
      if (paused($status)) return

      $status = 'paused'

      $end = $time

      driver.cancel($update)
    },

    reverse: () => {},

    finish: () => {},

    seek: () => {},

    then(onfulfilled: VoidFunction, onrejected?: VoidFunction) {
      return promise.get().then(onfulfilled, onrejected)
    },
  }
}
