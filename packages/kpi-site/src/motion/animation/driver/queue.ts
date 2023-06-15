export type AnyFunction = (...args: any[]) => any

export default function makeQueue<T extends AnyFunction>() {
  const current = new Set<T>()
  return {
    add: (fn: T) => current.add(fn),
    delete: (fn: T) => current.delete(fn),
    flush: (...args: Parameters<T>) => {
      current.forEach((fn) => !fn(...args) && current.delete(fn))
      return current.size
    },
  }
}
