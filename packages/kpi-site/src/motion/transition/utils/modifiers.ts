import type { EasingModifier } from '../interface'

export const easeInToEaseOut: EasingModifier = (easeIn) => (p) => 1 - easeIn(1 - p)

export const easeOutToEaseIn = easeInToEaseOut

export const easeInToEaseInOut: EasingModifier = (easeIn) => (p) =>
  p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn(2 * (1 - p)) / 2
