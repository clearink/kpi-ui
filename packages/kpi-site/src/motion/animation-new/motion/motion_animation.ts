/* eslint-disable class-methods-use-this */
import { noop } from '@kpi/shared'
import { easing } from '../../tween'

import type { MotionValue } from '.'
import { setMotionStatus } from './moition_status'

export default class MotionAnimation {
  time = 0

  duration = 300

  ease = easing.linear

  from = 0

  to = 0

  resolve: VoidFunction = noop

  constructor(props: any) {
    const { original, target, duration, ease, resolve } = props

    this.from = original
    this.to = target
    this.duration = duration
    this.ease = ease
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
    this.resolve()
  }

  onStop = (value: MotionValue) => {
    this.resolve()
    value.notify('onStop')
  }
}
