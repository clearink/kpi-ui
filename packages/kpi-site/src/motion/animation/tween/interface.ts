export type TweenType = 'value' | 'element'
export type Tween = ValueTween | ElementTween

export interface ValueTween {
  readonly delay: number
  readonly end: number
  readonly start: number
  readonly duration: number
  tick: (time: number) => void
}
export interface ElementTween extends Omit<ValueTween, 'type'> {
  readonly targets: Element[]
}
