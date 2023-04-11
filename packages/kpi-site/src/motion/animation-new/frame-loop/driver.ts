/* eslint-disable max-classes-per-file */
import { isNull } from '@kpi/shared'
import each from '../../utils/each'
import auto, { caf, nextFrame, raf } from '../../utils/raf'
import now from '../../utils/now'
import { measureFrameDelta } from '../../utils/frame_data'

export interface Queue<T extends Function = any> {
  size: number
  add: (fn: T) => void
  delete: (fn: T) => boolean
  flush: (arg?: any) => number
}

const makeQueue = <T extends Function>(): Queue<T> => {
  const current = new Set<T>()

  return {
    get size() {
      return current.size
    },
    add: (fn: T) => {
      current.add(fn)
    },
    delete: (fn: T) => {
      return current.delete(fn)
    },
    flush: (arg?: any) => {
      each(current, (fn) => !fn(arg) && current.delete(fn))
      return current.size
    },
  }
}

export class FrameLoopDriver {
  private queue = makeQueue()

  private _stop: null | VoidFunction = null

  private _autoFrame = auto

  private _update = () => {
    this._stop = this._autoFrame((t) => {
      const done = this.queue.flush(t) === 0

      if (done) this._stop = null

      return !done
    })
  }

  start = (fn: Function) => {
    this.queue.add(fn)

    if (!this._stop) this._update()
  }

  cancel = (fn: Function) => {
    this.queue.delete(fn)
  }

  use = (_raf: typeof raf, _caf: typeof caf) => {
    this._autoFrame = createAutoFrame(_raf, caf)
  }

  get = () => {
    return {
      now,

      nextFrame,

      start: this.start,

      cancel: this.cancel,
    }
  }
}
export default new FrameLoopDriver().get()
