import decompose from '../../utils/decompose'

import type { AnimatableValue } from '../interface'

type CanTweenValue = ReturnType<typeof decompose>
export default class TweenAnimation<V extends AnimatableValue = AnimatableValue> {
  initialized = false

  tuple: CanTweenValue[] = []

  // 外部自行定义
  init!: () => void

  // 渲染
  render = (next: (output: [number, number]) => number) => {
    const [from, to] = this.tuple

    const numbers = to.numbers.map((num, i) => next([from.numbers[i] || 0, num]))

    if (to.numeric) return numbers[0]

    return to.strings.reduce((r, s, i) => `${r + s}${numbers[i] ?? ''}`, '')
  }

  constructor(public from: V, public to: V) {}
}
