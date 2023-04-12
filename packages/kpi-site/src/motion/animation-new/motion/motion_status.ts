export default class MotionStatus {
  private _status: AnimationPlayState = 'idle'

  private _animated = false

  get status() {
    return this._status
  }

  set status(status: typeof this._status) {
    this._status = status
  }

  get running() {
    return this.status === 'running'
  }

  get paused() {
    return this._status === 'paused'
  }

  get animated() {
    return this._animated
  }

  set animated(animated: boolean) {
    this._animated = animated
  }
}
