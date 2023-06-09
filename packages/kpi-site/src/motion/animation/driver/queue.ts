export type AnyFunction = (...args: any[]) => any
export default class Queue<T extends AnyFunction> {
  private current = new Set<T>()

  add = (fn: T) => this.current.add(fn)

  delete = (fn: T) => this.current.delete(fn)

  flush = (...args: Parameters<T>) => {
    this.current.forEach((fn) => !fn(...args) && this.delete(fn))

    return this.current.size
  }
}
