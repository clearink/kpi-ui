const defaultTimestep = (1 / 60) * 1000

const getCurrentTime = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())
const start =
  typeof window !== 'undefined' && typeof window.requestAnimationFrame !== 'undefined'
    ? window.requestAnimationFrame
    : (callback: FrameRequestCallback) =>
        setTimeout(() => callback(getCurrentTime()), defaultTimestep) as unknown as number
const stop =
  typeof window !== 'undefined' && typeof window.cancelAnimationFrame !== 'undefined'
    ? window.cancelAnimationFrame
    : clearTimeout

export default function raf(callback: FrameRequestCallback, timeout = 0) {
  let id: number | undefined

  const init = getCurrentTime()

  ;(function loop() {
    const now = getCurrentTime()

    if (now - init > timeout) callback(now)
    else id = start(loop)
  })()

  return () => stop(id!)
}
