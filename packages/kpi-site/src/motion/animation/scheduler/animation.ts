import type { AnimatableValue } from '../interface'

export default class TweenAnimation {
  // 初始化
  private initialized = false

  init() {
    if (this.initialized) return

    this.initialized = true
  }

  /**
   * 为了便于扩展,将传入一个 accessor 用于获取.设置值
   */
  constructor(private tuple: AnimatableValue[]) {
    console.log(this.tuple)
  }

  render(progress: number) {
    console.log(progress)
  }
}

export interface TweenAccessor {
  get: () => any
  set: () => any
}
