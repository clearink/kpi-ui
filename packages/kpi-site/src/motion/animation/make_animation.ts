// /* eslint-disable class-methods-use-this */
// import { noop } from '@kpi/shared'
// import { easings } from '../tween'

// import type { MotionValue } from '../motion'

// // 参考 anime.js 的 animations 对象
// export default class MotionAnimation {
//   // 动画持续的时间
//   startTime = 0

//   currentTime = 0

//   lastTime = 0

//   duration = 300

//   step = 0

//   easing = easings.linear

//   from = 0

//   to = 0

//   resume = false

//   resolve: VoidFunction = noop

//   constructor(props: any) {
//     const { original, target, duration, easing, resolve } = props

//     this.from = original
//     this.to = target
//     this.duration = duration
//     this.easing = easing
//     this.resolve = resolve
//   }

//   onStart = (t: number, value: MotionValue) => {
//     this.startTime = t
//     // if (!this.currentTime) value.notify('start')
//   }

//   onUpdate = (current: number, value: MotionValue, t: number) => {
//     // value.notify('change', current)
//     // value.set(current)
//     this.currentTime = t + this.lastTime - this.startTime
//   }

//   onComplete = (value: MotionValue) => {
//     // value.notify('finish')
//     // value.status = 'finished'
//     // set motion value to target
//     // eslint-disable-next-line no-param-reassign
//     // value.animation = null
//     this.resolve()
//   }
// }
/* eslint-disable class-methods-use-this */

import { isNumber, toArray } from '@kpi/shared'
import { colorToRgba, isColor } from '../parse/color'

import type { MotionValue } from '../motion'
import type { AnimatableValue, GenericKeyframes } from './interface'

// // 'object' | 'attribute' | 'transform' | 'css'
// type AnimationType = any

// 实现 anime.js 的 anime() 的返回值

// handles exponents notation

// const transform = (numbers: number[], strings: string[]) => {
//   return strings.reduce((result, str, i) => {
//     const num = numbers[i] ?? ''
//     return `${result}${str}${num}`
//   }, '')
// }

// 创建 anime.js 中的 animations 对象, 动画的调度是在 playbackControl 实现的
// 1. 需要有 from
// 2. 需要有 to
// 3. 需要有对应的 parser，transform 来解析，生成需要的数据

function normalizeOriginalValue(value: string | number) {
  const reg = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g

  const numbers = isNumber(value) ? toArray(value) : (value.match(reg) || [0]).map(Number)
  const strings = `${value}`.split(reg)
  return { numbers, strings }
}

export class MotionAnimation<V extends AnimatableValue = AnimatableValue> {
  from!: { original: V; transform: (input: any) => V }

  to!: { original: V; transform: (input: any) => V }
  // export interface MotionAnimation {
  //   from: { numbers: number[]; strings: string[] }
  //   to: this['from']
  // }
}

export function makeAnimation<V extends AnimatableValue>(
  motion: MotionValue<V>,
  keyframes: V | GenericKeyframes<V>
): MotionAnimation<V>[] {
  // const target = resolvedTarget(value.get(), unResolvedTarget)

  const original = motion.get()
  const target = toArray(keyframes)
  // eslint-disable-next-line no-nested-ternary
  const o = isNumber(original) ? original : isColor(original) ? colorToRgba(original) : original

  // eslint-disable-next-line no-nested-ternary
  const t = isNumber(target) ? target : isColor(target) ? colorToRgba(target) : target

  const from = normalizeOriginalValue(o)
  const to = normalizeOriginalValue(t)

  return [
    {
      get from() {
        return from
      },
      get to() {
        return to
      },
    },
  ]
}
