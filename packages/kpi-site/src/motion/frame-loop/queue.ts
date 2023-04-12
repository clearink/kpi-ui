import each from '../utils/each'

const makeQueue = <T extends Function>() => {
  const current = new Set<T>()

  return {
    add: (fn: T) => {
      return current.add(fn)
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

export default makeQueue
