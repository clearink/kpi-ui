import driver from '../../../frame-loop'
import { Options } from '../../../config/options'
import { paused } from '../../utils/status'

import type Tween from '../tween'
import type { AnimatableValue } from '../../interface'
import { pushItem } from '../../../utils/array'
import { isCompleted, isWaiting } from '../tween'

export type PlaybackControl = ReturnType<typeof playbackControl>

export function playbackControl<V extends AnimatableValue>(tweens: Tween<V>[]) {
  // const promise = motion[$promise]
  // // 清除上一次的 resolve
  // promise.update(true)

  const $duration = tweens[tweens.length - 1]?.end ?? Options.duration

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

  const sliding: [number, number] = [-0.1, -0.1]

  const $update = (t: number) => {
    if (!$start) $start = t

    $animated = true

    $time = t + $end - $start

    pushItem(sliding, $time / $duration).shift()

    if (isWaiting(sliding)) return true

    if (isCompleted(sliding)) return false

    // if(repeat){ do some things}

    tweens.forEach((tween) => tween.tick($time))

    // update 只能触发 start, update, complete 三种事件
    // 还有其他的事件需要在外部触发

    return true
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
      $status = 'running'
      driver.start($update)
    },

    reset: () => {},

    replay: () => {},

    cancel: () => {
      $status = 'idle'
      // motion.notify('cancel')
      // promise.update(true)
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
      // return promise.get().then(onfulfilled, onrejected)
    },
  }
}
