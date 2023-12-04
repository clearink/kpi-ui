import { isFunction } from '@kpi-ui/utils'

export function nextFrame(callback: () => void) {
  const ids: number[] = Array(2)

  ids[0] = requestAnimationFrame(() => {
    ids[1] = requestAnimationFrame(callback)
  })

  return () => ids.forEach(cancelAnimationFrame)
}

export function nextTick(callback: () => void) {
  if (isFunction(queueMicrotask)) queueMicrotask(callback)
  // TODO: 考虑 MutationObserver  setTimeout
  else Promise.resolve().then(callback)
}
