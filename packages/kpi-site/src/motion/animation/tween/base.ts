import clamp from '../../utils/clamp'

import type { TweenTransition } from './interface'

export default function tweenBase<V>(
  generator: (number) => V,
  trigger: () => void,
  transition: TweenTransition
) {
  let $delay = transition.delay
  let $start = transition.start
  let $duration = transition.duration

  // TODO: 是否只用返回 tick 一个函数即可呢 ?
  return {
    get start() {
      return $start
    },
    set start(start: number) {
      $start = start
    },
    get duration() {
      return $duration
    },
    set duration(duration: number) {
      $duration = duration
    },
    get delay() {
      return $delay
    },
    set delay(delay: number) {
      $delay = delay
    },
    get end() {
      return this.delay + this.start + this.duration
    },
    tick: (time: number) => {
      const elapsed = clamp(time - $start - $delay, 0, $duration)

      const current = generator(elapsed / $duration)

      // TODO: trigger events
      // trigger(time, $duration, current)
    },
  }
}
//  {
//   private generator: (elapsed: number) => V

//   constructor(motion: MotionValue<V>, targets: V[]) {
//     this.generator = createTweenGenerator(targets, times, easings)
//   }

//   private _start = 0

//   get start() {
//     return this._start
//   }

//   set start(start: number) {
//     this._start = start
//   }

//   private _delay = 0

//   get delay() {
//     return this._delay
//   }

//   set delay(delay: number) {
//     this._delay = delay
//   }

//   private _duration = 0

//   get duration() {
//     return this._duration
//   }

//   get end() {
//     return this.delay + this.start + this.duration
//   }

//   tick = (time: number) => {
//     const elapsed = clamp(time - this.start - this.delay, 0, this.duration)

//     const current = this.generaotr(elapsed / this.duration)

//     // trigger events
//   }
// }
