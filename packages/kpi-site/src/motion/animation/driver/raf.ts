import { isFunction, isUndefined } from '@kpi/shared'
import { frameData } from './delta'

export const now = (() => {
  if (!isUndefined(performance)) return () => performance.now()

  if (isFunction(Date.now)) return () => Date.now()

  return () => new Date().getTime()
})()

export const raf: (callback: FrameRequestCallback) => number = (() => {
  if (globalThis && isFunction(globalThis.requestAnimationFrame)) {
    return globalThis.requestAnimationFrame.bind(null)
  }
  return (callback: FrameRequestCallback) =>
    setTimeout(() => callback(now()), frameData.delta) as unknown as number
})()

export const caf: (handle: number) => void = (() => {
  if (globalThis && isFunction(globalThis.cancelAnimationFrame)) {
    return globalThis.cancelAnimationFrame.bind(null)
  }
  return clearTimeout.bind(null)
})()
