export interface Tween {
  readonly delay: number
  readonly end: number
  readonly start: number
  readonly duration: number
  tick: (time: number) => void
}
