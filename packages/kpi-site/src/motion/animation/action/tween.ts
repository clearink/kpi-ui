import { pushItem } from '../../utils/array'
import clamp from '../../utils/clamp'

import type { AnimatableValue } from '../interface'

export default class Tween<V extends AnimatableValue = AnimatableValue> {
  public start = 0

  public duration = 0

  public delay = 0

  public get end() {
    return this.start + this.delay + this.duration
  }

  // 维护一个滑动窗口用来检测是否可以 animated
  public sliding: [number, number] = [-0.1, -0.1]

  public tick: (time: number) => void

  constructor(generator: (progress: number) => NonNullable<V>) {
    this.tick = (time: number) => {
      let elapsed = (time - this.start - this.delay) / this.duration

      elapsed = Number.isNaN(elapsed) ? 1 : elapsed

      pushItem(this.sliding, elapsed).shift()

      if (isWaiting(this.sliding) || isCompleted(this.sliding)) return null

      const progress = clamp(elapsed, 0, 1)

      const current = generator(progress)

      return current
    }
  }
}

export const isWaiting = (sliding: [number, number]) => {
  const [one, two] = sliding
  return one < 0 && two < 0
}

export const isCompleted = (sliding: [number, number]) => {
  const [one, two] = sliding
  return one >= 1 && two > 1
}

export const isStarting = (sliding: [number, number]) => {
  const [one, two] = sliding
  return one < 0 && two >= 0
}

export const isCompleting = (sliding: [number, number]) => {
  const [one, two] = sliding
  return one < 1 && two >= 1
}
