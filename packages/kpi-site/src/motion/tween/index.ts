import easings from './eases'

export { default as cubicBezier } from './cubic_bezier'
export { default as steps } from './steps'
export { default as easings } from './eases'

export type EasingDefinition = keyof typeof easings
