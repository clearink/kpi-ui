import each from '../../utils/each'
import now from '../../utils/now'
import raf, { nextTick } from '../../utils/raf'

export interface Queue<T extends Function = any> {
  size: number
  add: (fn: T) => void
  delete: (fn: T) => boolean
  flush: (arg?: any) => number
}

const createQueue = <T extends Function>(): Queue<T> => {
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

let cancel: null | VoidFunction = null

const update = (queue: Queue) => {
  cancel = raf((t) => {
    const done = queue.flush(t) === 0

    if (done) cancel = null

    return !done
  })
}

const createDriver = () => {
  const queue = createQueue()

  return {
    start: (fn: Function) => {
      queue.add(fn)
      if (!cancel) update(queue)
    },
    cancel: (fn: Function) => {
      queue.delete(fn)
    },
    now,
    nextTick,
  }
}

export default createDriver()
