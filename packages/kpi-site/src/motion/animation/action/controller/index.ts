import { isNull, noop } from '@kpi/shared'
import driver from '../../../frame-loop'
import Tween from '../tween'
import createEmitter from './emitter'

import type { AnimatableValue } from '../../interface'

// export function playbackControl<V extends AnimatableValue>(tweens: Tween<V>[]) {
//   // const promise = motion[$promise]
//   // // 清除上一次的 resolve
//   // promise.update(true)

//   // 每个 tween 有一个自己的 trigger
//   // 整个 control 也有一个自己的 trigger
//   // TODO: 设置 tweens 的 transition 数据
//   // TODO:

//   const $duration = tweens[tweens.length - 1]?.end ?? 0

//   // 是否运行动画过
//   let $animated = false
//   // 状态
//   let $status: AnimationPlayState = 'idle'
//   // 运动开始时间
//   let $start = 0
//   // 运动结束时间
//   let $end = 0
//   // 运动经过的时长
//   let $time = 0

//   const $delay = 0

//   const sliding: number[] = [-Infinity, -Infinity]

//   const $update = (t: number) => {
//     if (!$start) $start = t

//     $animated = true

//     $time = t + $end - $start - $delay

//     // TODO: repeat logic

//     pushItem(sliding, $time / $duration).shift()

//     if (isWaiting(sliding)) return true

//     if (isCompleted(sliding)) return false

//     tweens.forEach((tween) => tween.tick($time))

//     // update 只能触发 start, update, complete 三种事件
//     // 还有其他的事件需要在外部触发

//     return true
//   }

//   return {
//     get time() {
//       return $time
//     },

//     get status() {
//       return $status
//     },

//     get animated() {
//       return $animated
//     },

//     get speed() {
//       return 1
//     },

//     get duration() {
//       return $duration
//     },

//     // "finished" | "idle" | "paused" | "running"
//     play: () => {
//       $status = 'running'
//       driver.start($update)
//     },

//     reset: () => {},

//     replay: () => {},

//     cancel: () => {
//       $status = 'idle'
//       // motion.notify('cancel')
//       // promise.update(true)
//       driver.cancel($update)
//     },

//     stop: () => {},

//     pause: () => {
//       if (paused($status)) return

//       $status = 'paused'

//       $end = $time

//       driver.cancel($update)
//     },

//     reverse: () => {},

//     seek: () => {},

//     then(onfulfilled: VoidFunction, onrejected?: VoidFunction) {
//       // return promise.get().then(onfulfilled, onrejected)
//     },
//   }
// }

export default class Controller<V extends AnimatableValue = AnimatableValue> extends Tween<V> {
  public status: AnimationPlayState = 'idle'

  private update: (time: number) => boolean

  constructor(private tweens: Tween[]) {
    super(noop, (t) => t as V)

    const emitter = createEmitter()

    this.update = (time: number) => {
      // 获取当前的 animate 的进度 progress 在 [0, 1] 之间
      const progress = this.tick(time)

      if (isNull(progress)) return !this.completed

      if (this.starting) console.log(`trigger('start')`, this.window)

      const results = this.tweens.map((tween) => tween.tick(progress[0] * this.duration))

      this.tweens.forEach((tween) => tween.starting && tween.notify('start'))

      // emit tweens update
      this.tweens.forEach((tween, index) => {
        const result = results[index]
        !isNull(result) && tween.notify('update', result[1])
      })
      console.log(`trigger('update')`, results)
      emitter('update', this.tweens)

      this.tweens.forEach((tween) => tween.completing && tween.notify('complete'))

      if (this.completing) console.log(`trigger('complete')`)

      return !this.completed
    }
  }

  public play = () => {
    // "finished" | "idle" | "paused" | "running"
    this.status = 'running'
    driver.start(this.update)
  }

  public stop = () => {
    this.status = 'idle'
    driver.cancel(this.update)
  }
}
