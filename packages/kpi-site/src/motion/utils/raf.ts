import { frameData, measureFrameDelta } from './frame_data'
import now from './now'

export const raf: (callback: FrameRequestCallback) => number =
  typeof window !== 'undefined' && typeof window.requestAnimationFrame !== 'undefined'
    ? window.requestAnimationFrame
    : (callback: FrameRequestCallback) =>
        setTimeout(() => callback(now()), frameData.delta) as unknown as number
export const caf: (handle: number) => void =
  typeof window !== 'undefined' && typeof window.cancelAnimationFrame !== 'undefined'
    ? window.cancelAnimationFrame
    : clearTimeout

export default function auto(callback: (t: number) => boolean | void) {
  let id: number

  function loop(t: number) {
    if (!callback(t)) return

    measureFrameDelta(t)

    id = raf(loop)
  }

  id = raf(loop)

  return () => caf(id)
}
