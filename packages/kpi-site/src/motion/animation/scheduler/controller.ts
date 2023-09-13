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
    // animation 上次更新的时间
    let $lastTime = 0
    // animation 当前的时间
    let $currentTime = 0
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

      const elapsed = $lastTime ? timestamp - $lastTime : 0

      $lastTime = timestamp

      $currentTime += elapsed * this.speed

      const reversed = this.speed < 0

      const adjusted = reversed ? duration - $currentTime : $currentTime

      timelines.forEach((timeline) => timeline.schedule(adjusted, reversed))

      if (adjusted < duration) return true

      $status = 'finished'

      $promise.update()

      return false
    }

    const reset = () => {
      $lastTime = 0
      $currentTime = this.speed > 0 ? 0 : duration

      // 重置时强行回到原始位置
      timelines.forEach((timeline) => timeline.reset(this.speed < 0))
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

      $lastTime = 0

      driver.cancel(tick)
    }
  }
}
