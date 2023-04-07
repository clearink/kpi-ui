/* eslint-disable class-methods-use-this */
/**
 * TODO
 * 为了提高性能, 需要将多个 animate 集中在一个 raf 回调中执行,减少浏览器的回流
 */
// export interface FrameLoop {
//   start: (callback: (t: number) => void) => number
//   stop: (id: number) => void
//   now: () => number
// }

import raf, { nextTick } from '../utils/raf'

class FrameLoop {
  start = () => {}

  stop = () => {}

  nextTick = nextTick
}
export default new FrameLoop()

const frameLoop = new FrameLoop()
