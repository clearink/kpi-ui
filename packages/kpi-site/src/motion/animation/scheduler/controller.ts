import { defineGetter } from '../../utils/define'
import driver from '../driver'
import makeControlledPromise from '../utils/controlled_promise'
import { max } from '../utils/math'

import type { AnimationStatus } from '../interface'
import type TweenTimeline from './timeline'

const running = (status: AnimationStatus) => status === 'running'

const canceled = (status: AnimationStatus) => status === 'canceled'

const finished = (status: AnimationStatus) => status === 'finished'

export default class TweenController {
  readonly status!: AnimationStatus

  speed = 1

  play: (restart?: boolean) => void

  cancel: () => void

  pause: () => void

  reverse: () => void

  then!: (onfulfilled?: VoidFunction, onrejected?: VoidFunction) => Promise<void>

  constructor(timelines: TweenTimeline[]) {
    const $time = { prev: 0, curr: 0 }
    // animation 状态
    let $status: AnimationStatus = 'paused'

    defineGetter(this, 'status', () => $status)

    const $promise = makeControlledPromise()
    $promise.update()

    defineGetter(this, 'then', () => (onfulfilled?: VoidFunction, onrejected?: VoidFunction) => {
      return $promise.get().then(onfulfilled, onrejected)
    })

    const duration = max(timelines.map(({ scheduler }) => scheduler.end))

    const tick = (timestamp: number) => {
      if (!running($status)) return false

      const elapsed = $time.prev ? timestamp - $time.prev : 0

      $time.prev = timestamp

      $time.curr += elapsed * this.speed

      const reversed = this.speed < 0

      const adjusted = reversed ? duration - $time.curr : $time.curr

      timelines.forEach((timeline) => timeline.schedule(adjusted, reversed))

      if (adjusted < duration) return true

      $status = 'finished'

      $promise.update()

      return false
    }

    const reset = () => {
      const reversed = this.speed < 0
      $time.prev = 0
      $time.curr = reversed ? duration : 0
      // 重置时强行回到原始位置
      timelines.forEach((timeline) => timeline.reset(reversed))
    }

    // 运行/重新运行
    this.play = (restart = false) => {
      if (canceled($status)) return

      if (restart || finished($status)) reset()

      $status = 'running'

      driver.start(tick)
    }

    // 反转
    this.reverse = () => {
      if (canceled($status)) return

      this.speed *= -1

      this.play()
    }

    // 取消
    this.cancel = () => {
      if (canceled($status)) return

      $status = 'canceled'

      driver.cancel(tick)
    }

    // 暂停
    this.pause = () => {
      if (canceled($status)) return

      $status = 'paused'

      $time.prev = 0

      driver.cancel(tick)
    }
  }
}
