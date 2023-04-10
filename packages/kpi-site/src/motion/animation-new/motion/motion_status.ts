import defineHidden from '../../utils/define_hidden'
import { $status, $animated } from '../../utils/symbol'

import type { MotionValue } from '.'

export function setMotionStatus(value: MotionValue, status: AnimationPlayState) {
  defineHidden(value, $status, status)
}

export function getMotionStatus(value: MotionValue) {
  return value[$status] as AnimationPlayState
}

export function motionRunning(value: MotionValue) {
  return getMotionStatus(value) === 'running'
}

export function motionFinished(value: MotionValue) {
  return getMotionStatus(value) === 'finished'
}

export function motionAnimated(value: MotionValue) {
  return !!value[$animated]
}
