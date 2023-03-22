import type { MotionValue } from '../motion'

export type StartAnimation = any
export type ResolvedValueTarget = any
export type Transition = any

export default function animateMotionValue(
  valueName: string,
  from: MotionValue,
  target: ResolvedValueTarget,
  transition: Transition & { elapsed?: number } = {}
): StartAnimation {
  return (onComplete: VoidFunction) => {}
}
