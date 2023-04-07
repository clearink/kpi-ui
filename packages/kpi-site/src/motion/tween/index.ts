import easing from './ease'

export { default as cubicBezier } from './cubic_bezier'
export { default as steps } from './steps'
export { default as easing } from './ease'

export type EasingDefinition = keyof typeof easing
