import noop from '../noop'
import isBrowser from './is_browser'

export const raf = isBrowser()
  ? requestAnimationFrame
  : (noop as unknown as typeof requestAnimationFrame)

export const caf = isBrowser()
  ? cancelAnimationFrame
  : (noop as unknown as typeof cancelAnimationFrame)

export function nextFrame(callback: () => void) {
  const ids: number[] = Array(2)

  ids[0] = raf(() => {
    ids[1] = raf(callback)
  })

  return () => ids.forEach(caf)
}

export function loopFrame(callback: () => any) {
  let id: number

  const tick = () => {
    if (callback()) id = raf(tick)
  }

  id = raf(tick)

  return () => caf(id)
}

export function nextTick(callback: () => void) {
  const id = raf(callback)

  return () => caf(id)
}
