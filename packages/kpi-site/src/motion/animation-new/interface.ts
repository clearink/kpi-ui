export interface AnimationPlaybackControls {
  time: number
  speed: number

  /*
   * The duration is the duration of time calculated for the active part
   * of the animation without delay or repeat,
   * which may be added as an extra prop at a later date.
   */
  duration: number

  stop: () => void
  play: () => void
  pause: () => void
  complete: () => void
  cancel: () => void
  then: (onResolve: VoidFunction, onReject?: VoidFunction) => Promise<void>
}
