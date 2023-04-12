/* eslint-disable class-methods-use-this */
import { noop } from '@kpi/shared'
import { easings } from '../../tween'

import type { MotionValue } from '.'

// 参考 anime.js 的 animations 对象
export default class MotionAnimation {
  // 动画持续的时间
  startTime = 0

  currentTime = 0

  lastTime = 0

  duration = 300

  step = 0

  easing = easings.linear

  from = 0

  to = 0

  resume = false

  resolve: VoidFunction = noop

  constructor(props: any) {
    const { original, target, duration, easing, resolve } = props

    this.from = original
    this.to = target
    this.duration = duration
    this.easing = easing
    this.resolve = resolve
  }

  onStart = (t: number, value: MotionValue) => {
    this.startTime = t
    // if (!this.currentTime) value.notify('start')
  }

  onUpdate = (current: number, value: MotionValue, t: number) => {
    // value.notify('change', current)
    // value.set(current)
    this.currentTime = t + this.lastTime - this.startTime
  }

  onComplete = (value: MotionValue) => {
    // value.notify('finish')
    // value.status = 'finished'
    // set motion value to target
    // eslint-disable-next-line no-param-reassign
    // value.animation = null
    this.resolve()
  }
}
