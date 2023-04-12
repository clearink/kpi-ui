import { isFunction, isUndefined } from '@kpi/shared'
import { frameData } from './delta'

export const now = (() => {
  if (!isUndefined(performance)) return () => performance.now()

  if (isFunction(Date.now)) return () => Date.now()

  return () => new Date().getTime()
})()

export const raf: (callback: FrameRequestCallback) => number = (() => {
  if (isFunction(globalThis.requestAnimationFrame)) {
    return globalThis.requestAnimationFrame.bind(null)
  }
  return (callback: FrameRequestCallback) =>
    globalThis.setTimeout(() => callback(now()), frameData.delta) as unknown as number
})()

export const caf: (handle: number) => void = (() => {
  if (isFunction(globalThis.cancelAnimationFrame)) {
    return globalThis.cancelAnimationFrame.bind(null)
  }
  return globalThis.clearTimeout.bind(null)
})()
