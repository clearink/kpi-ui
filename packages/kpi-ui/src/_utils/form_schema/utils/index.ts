export function isPromiseLike(value: any): value is PromiseLike<unknown> {
  return !!value && typeof value.then === 'function'
}
export const a = 1
