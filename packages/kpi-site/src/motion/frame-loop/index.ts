/**
 * TODO
 * 为了提高性能, 需要将多个 animate 集中在一个 raf 回调中执行,减少浏览器的回流
 */
export interface FrameLoop {
  start: (callback: (t: number) => void) => number
  stop: (id: number) => void
  now: () => number
}

const frameLoop = {}
export default frameLoop
