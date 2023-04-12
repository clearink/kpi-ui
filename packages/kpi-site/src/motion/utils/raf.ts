import { frameData } from '../frame-loop/delta'
import now from './now'

export const raf: (callback: FrameRequestCallback) => number =
  typeof window !== 'undefined' && typeof window.requestAnimationFrame !== 'undefined'
    ? window.requestAnimationFrame.bind(null)
    : (callback: FrameRequestCallback) =>
        setTimeout(() => callback(now()), frameData.delta) as unknown as number
export const caf: (handle: number) => void =
  typeof window !== 'undefined' && typeof window.cancelAnimationFrame !== 'undefined'
    ? window.cancelAnimationFrame.bind(null)
    : clearTimeout
