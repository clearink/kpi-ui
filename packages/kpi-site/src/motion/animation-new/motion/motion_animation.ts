/* eslint-disable class-methods-use-this */
import { noop } from '@kpi/shared'
import { easings } from '../../tween'

import type { MotionValue } from '.'
import { setMotionStatus } from './motion_status'

export default class MotionAnimation {
  time = 0

  duration = 300

  easing = easings.linear

  from = 0

  to = 0

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
    this.time = t
    value.notify('onStart')
  }

  onUpdate = (current: number, value: MotionValue) => {
    value.notify('onUpdate', current)
    value.set(current)
  }

  onComplete = (value: MotionValue) => {
    value.notify('onComplete')
    setMotionStatus(value, 'finished')
    // set motion value to target
    // eslint-disable-next-line no-param-reassign
    value.animation = null
    this.resolve()
  }
}
