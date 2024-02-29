export const raf =
  typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame
    : (setTimeout as typeof requestAnimationFrame)

export const caf =
  typeof cancelAnimationFrame === 'function'
    ? cancelAnimationFrame
    : (clearTimeout as typeof cancelAnimationFrame)

export function nextFrame(callback: () => void) {
  // prettier-ignore
  const id = raf(() => { callback() })

  // prettier-ignore
  return () => { caf(id) }
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
