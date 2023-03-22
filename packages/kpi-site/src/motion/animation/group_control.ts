/* eslint-disable class-methods-use-this */
import type { AnimationPlaybackControls } from './animate'

export default class GroupPlaybackControls implements AnimationPlaybackControls {
  constructor(private animations: AnimationPlaybackControls[]) {}

  stop = () => {}

  animating = () => {
    return true
  }
}
