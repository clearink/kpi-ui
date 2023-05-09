import { easings } from '.'

export type EasingDefinition = keyof typeof easings

export type EasingFunction = (x: number) => number

export type EasingModifier = (easing: EasingFunction) => EasingFunction

export type BezierDefinition = [number, number, number, number]

export type Easing = BezierDefinition | EasingFunction | EasingDefinition
