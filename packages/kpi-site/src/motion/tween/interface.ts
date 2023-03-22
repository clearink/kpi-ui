import type { EasingDefinition } from './easing'

export type EasingFunction = (x: number) => number

export type EasingModifier = (easing: EasingFunction) => EasingFunction

export type BezierDefinition = [number, number, number, number]

export type Easing = BezierDefinition | EasingFunction | EasingDefinition
