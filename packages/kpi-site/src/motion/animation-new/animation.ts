/* eslint-disable class-methods-use-this */

import { isNumber, toArray } from '@kpi/shared'
import { colorToRgba, isColor } from '../parse/color'

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

// 创建 anime.js 中的  animations 对象, 动画的调度是在 playbackControl 实现的
// 1. 实现 thenable 不然无法感知到是否结束了
// 2. 需要有 from
// 3. 需要有 to
// 4. 需要有对应的 parser，transform 来解析，生成需要的数据

export interface MotionAnimation {
  from: { numbers: number[]; strings: string[] }
  to: this['from']
}

function normalizeOriginalValue(value: string | number) {
  const reg = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g

  const numbers = isNumber(value) ? toArray(value) : (value.match(reg) || [0]).map(Number)
  const strings = `${value}`.split(reg)
  return { numbers, strings }
}

export function motionAnimation<V extends string | number = any>(
  original: V,
  target: V
): MotionAnimation {
  // const target = resolvedTarget(value.get(), unResolvedTarget)

  // eslint-disable-next-line no-nested-ternary
  const o = isNumber(original) ? original : isColor(original) ? colorToRgba(original) : original

  // eslint-disable-next-line no-nested-ternary
  const t = isNumber(target) ? target : isColor(target) ? colorToRgba(target) : target

  const from = normalizeOriginalValue(o)
  const to = normalizeOriginalValue(t)

  return {
    get from() {
      return from
    },
    get to() {
      return to
    },
  }
}
