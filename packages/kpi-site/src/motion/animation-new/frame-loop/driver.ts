/* eslint-disable max-classes-per-file */
import each from '../../utils/each'
import now from '../../utils/now'
import raf, { nextTick } from '../../utils/raf'

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

  private _update = () => {
    // 删除 raf 改用 nextTick, 且 外部能够自定义 raf 方法
    this._stop = raf((t) => {
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

  get = () => {
    return {
      now,

      nextTick,

      start: this.start,

      cancel: this.cancel,
    }
  }
}
export default new FrameLoopDriver().get()
