/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */

import { isObject } from '@kpi/shared'
import { motionValueSymbol } from '../utils/symbol'
import MotionValueEvent from './motion_event'

import type { MotionValueEventCallbacks } from './motion_event'
import type { AnimationPlaybackControls } from '../animation/animate'

type StartAnimation = (onComplete: () => void) => AnimationPlaybackControls

export class MotionValue<V = any> {
  readonly $type = motionValueSymbol

  prev: V

  current: V

  constructor(initial: V) {
    this.prev = initial
    this.current = initial
  }

  events = new MotionValueEvent<V>()

  on = <T extends keyof MotionValueEventCallbacks<V>>(
    type: T,
    handler: MotionValueEventCallbacks<V>[T]
  ) => {
    const ubsubscribe = this.events.on(type, handler)

    if (type !== 'update') return ubsubscribe

    // sync animation frame
    // stop animation
    return ubsubscribe
  }

  // 取消动画回调函数
  cancel: null | AnimationPlaybackControls = null

  get animating() {
    return !!this.cancel
  }

  // 是否执行过动画
  animated = false

  // 开始动画
  start = (animation: StartAnimation) => {
    this.stop()

    return new Promise<void>((resolve) => {
      this.animated = true
      this.cancel = animation(resolve)

      this.events.notify('start')
    }).then(() => {
      this.events.notify('complete')

      this.clear()
    })
  }

  // 停止动画
  stop = () => {
    this.cancel && this.cancel.stop()
    this.cancel && this.events.notify('cancel')

    this.clear()
  }

  clear = () => {
    this.cancel = null
  }

  destroy = () => {
    this.events.clear()
    this.stop()
  }
}

export function isMotionValue(obj: any): obj is MotionValue {
  return isObject(obj) && (obj as MotionValue).$type === motionValueSymbol
}

export function motionValue<V>(initial: V | MotionValue<V>) {
  if (isMotionValue(initial)) return initial

  return new MotionValue(initial)
}
