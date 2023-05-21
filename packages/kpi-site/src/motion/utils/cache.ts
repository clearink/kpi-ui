import type { EasingFunction } from '../easing/interface'
import type { MotionValue } from '../motion'

export const cubicBezierCache = new Map<string, EasingFunction>()
export const motionPromiseCache = new WeakMap<MotionValue, any>()
