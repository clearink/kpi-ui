// /* eslint-disable class-methods-use-this */
// // css plugin 用于
// import { AnimatableValue } from '../animation/interface'
// import { TweenAnimation } from '../animation/scheduler'
// import { isMotionValue } from '../motion'
// import BasePlugin from './base'

// export default class CSSPlugin extends BasePlugin {
//   test: BasePlugin['test'] = ({ target }) => {
//     if (isMotionValue(target)) return false

//     const dom = target as HTMLElement

//     return !!dom.style && !!dom.nodeType
//   }

//   get: BasePlugin['get'] = ({ target }) => {
//     if (isMotionValue(target)) return

//     // 各种 accessor ?
//     return '123px'
//   }

//   set: BasePlugin['set'] = () => {}
// }
export default 1
