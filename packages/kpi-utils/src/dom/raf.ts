export const raf =
  typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame
    : (((callback) => setTimeout(callback, 16.667)) as typeof requestAnimationFrame)

export const caf =
  typeof cancelAnimationFrame === 'function'
    ? cancelAnimationFrame
    : (clearTimeout as typeof cancelAnimationFrame)

export function nextFrame(callback: () => void) {
  const ids = [-1, -1]

  // prettier-ignore
  ids[0] = raf(() => { ids[1] = raf(() => { callback() }) })

  // prettier-ignore
  return () => { caf(ids[0]); caf(ids[1]) }
}

export function loopFrame(callback: () => any) {
  let id: number

  // prettier-ignore
  const tick = () => { if (callback()) id = raf(tick) }

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
