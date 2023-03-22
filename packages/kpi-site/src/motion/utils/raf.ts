import { frameData, measureFrameInterval } from './frame_data'
import now from './now'

const start =
  typeof window !== 'undefined' && typeof window.requestAnimationFrame !== 'undefined'
    ? window.requestAnimationFrame
    : (callback: FrameRequestCallback) =>
        setTimeout(() => callback(now()), frameData.delta) as unknown as number
const stop =
  typeof window !== 'undefined' && typeof window.cancelAnimationFrame !== 'undefined'
    ? window.cancelAnimationFrame
    : clearTimeout

export default function raf(callback: (t: number) => boolean) {
  let id: number

  function loop(t: number) {
    if (!callback(t)) return

    measureFrameInterval(t)

    id = start(loop)
  }

  id = start(loop)

  return () => stop(id)
}
