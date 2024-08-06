export const now = typeof performance === 'undefined' ? () => Date.now() : () => performance.now()

export const raf: typeof requestAnimationFrame
  = typeof requestAnimationFrame === 'undefined'
    ? callback => setTimeout(callback, 16.667)
    : requestAnimationFrame

export const caf: typeof cancelAnimationFrame
  = typeof cancelAnimationFrame === 'undefined'
    ? clearTimeout
    : cancelAnimationFrame

export function currFrame(callback: (time: number) => void) {
  const id = raf(callback)

  return () => { caf(id) }
}

export function nextFrame(callback: (time: number) => void) {
  const ids = [-1, -1]

  ids[0] = raf(() => { ids[1] = raf(callback) })

  return () => { caf(ids[0]); caf(ids[1]) }
}

export function loopFrame(callback: (time: number) => boolean) {
  let id: number

  const tick = (time: number) => { if (callback(time)) id = raf(tick) }

  id = raf(tick)

  return () => { caf(id) }
}

export function nextTick(callback: () => void) {
  let isCancelled = false

  Promise.resolve().then(() => { !isCancelled && callback() })

  return () => { isCancelled = true }
}

export function makeFrameTimeout(timeout: number, callback: () => void) {
  const start = now()

  return loopFrame(time => (time - start < timeout ? true : (callback(), false)))
}
