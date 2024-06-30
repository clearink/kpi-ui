export const now = typeof performance === 'undefined' ? () => Date.now() : () => performance.now()

export const raf =
  typeof requestAnimationFrame === 'undefined'
    ? (((callback) => setTimeout(callback, 16.667)) as typeof requestAnimationFrame)
    : requestAnimationFrame

export const caf =
  typeof cancelAnimationFrame === 'undefined'
    ? (clearTimeout as typeof cancelAnimationFrame)
    : cancelAnimationFrame

export function nextFrame(callback: (time: number) => void) {
  const ids = [-1, -1]

  // prettier-ignore
  ids[0] = raf(() => { ids[1] = raf(callback) })

  // prettier-ignore
  return () => { caf(ids[0]); caf(ids[1]) }
}

export function loopFrame(callback: (time: number) => boolean) {
  let id: number

  // prettier-ignore
  const tick = (time: number) => { if (callback(time)) id = raf(tick) }

  id = raf(tick)

  // prettier-ignore
  return () => { caf(id) }
}

export function nextTick(callback: () => void) {
  let isCancelled = false

  // prettier-ignore
  Promise.resolve().then(() => { !isCancelled && callback() })

  // prettier-ignore
  return () => { isCancelled = true }
}

export function makeFrameTimeout(timeout: number, callback: () => void) {
  const start = now()

  return loopFrame((time) => (time - start < timeout ? true : (callback(), false)))
}
