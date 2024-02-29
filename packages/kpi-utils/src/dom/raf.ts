import noop from '../noop'
import isBrowser from './is_browser'

export const raf = isBrowser()
  ? requestAnimationFrame
  : (noop as unknown as typeof requestAnimationFrame)

export const caf = isBrowser()
  ? cancelAnimationFrame
  : (noop as unknown as typeof cancelAnimationFrame)

export function nextFrame(callback: () => void) {
  const cleanup = [-1, () => {}] as [number, () => void]

  // prettier-ignore
  cleanup[0] = raf(() => { cleanup[1] = nextTick(callback) })

  // prettier-ignore
  return () => { caf(cleanup[0]); cleanup[1]() }
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
