import now from './now'

const defaultTimestep = (1 / 60) * 1000

const start =
  typeof window !== 'undefined' && typeof window.requestAnimationFrame !== 'undefined'
    ? window.requestAnimationFrame
    : (callback: FrameRequestCallback) =>
        setTimeout(() => callback(now()), defaultTimestep) as unknown as number
const stop =
  typeof window !== 'undefined' && typeof window.cancelAnimationFrame !== 'undefined'
    ? window.cancelAnimationFrame
    : clearTimeout

export default function raf(callback: (t: number) => boolean) {
  let id: number

  function loop(t: number) {
    if (!callback(t)) return

    id = start(loop)
  }

  id = start(loop)

  return () => stop(id)
}
