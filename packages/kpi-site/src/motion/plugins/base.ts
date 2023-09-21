/* eslint-disable class-methods-use-this */

import type { AnimatableValue } from '../animation/interface'
import type { TweenAnimation } from '../animation/scheduler'

// 插件系统
export default abstract class BasePlugin {
  // 参考 vue.use
  install = () => {}

  // 检查是否支持该插件
  abstract test: (animation: TweenAnimation) => boolean

  // 获取
  abstract get: (animation: TweenAnimation) => AnimatableValue | void

  // 设置
  abstract set: (animation: TweenAnimation) => void
}

/**
 * animate.use(ValuePlugin) // motion value
 * animate.use(CssPlugin) // css
 * animate.use(AttrPlugin) // attr
 * animate.use(FlipPlugin) // flip
 */
