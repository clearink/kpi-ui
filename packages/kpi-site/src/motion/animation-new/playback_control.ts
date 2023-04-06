/* eslint-disable class-methods-use-this */

import type { MotionAnimation } from './animation'

export default class PlaybackControl {
  constructor(private animations: MotionAnimation[]) {}

  // motion control

  play = () => {
    this.animations.forEach((animation) => animation.play())
  }

  pause = () => {
    this.animations.forEach((animation) => animation.pause())
  }

  stop = () => {}

  complete = () => {}

  // thenable
  then = (onfulfilled: VoidFunction) => {
    return new Promise<void>((resolve) => {})
  }
}
/**
 *     time: number
    speed: number

    duration: number

    stop: () => void
    play: () => void
    pause: () => void
    complete: () => void
    cancel: () => void
    then: (onResolve: VoidFunction, onReject?: VoidFunction) => Promise<void>
 */
