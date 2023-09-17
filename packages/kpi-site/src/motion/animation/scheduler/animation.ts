import decompose from '../../utils/decompose'

type CanTweenValue = ReturnType<typeof decompose>
export interface TweenAnimation {
  readonly tuple: [CanTweenValue, CanTweenValue]

  init: () => void

  render: (progress: number, next: (output: [number, number]) => number) => any
}

// export class TweenAnimation2 {
//   // 2. easing
//   constructor(common: any, mirror: any) {
//     // 主要是 处理 easing
//   }
// }
