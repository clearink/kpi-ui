export function isPromiseLike(value: any): value is PromiseLike<unknown> {
  return !!value && typeof value.then === 'function'
}
