import type { EasingFunction } from '../easing/interface'
import type { MotionValue } from '../motion'

export const cubicBezierCache = new Map<string, EasingFunction>()
export const motionPromiseCache = new WeakMap<MotionValue, any>()

export const attrCache = new WeakMap<Element, any>()
export const cssCache = new WeakMap<Element, any>()
export const transformCache = new WeakMap<Element, any>()
