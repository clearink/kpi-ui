export function shallowEqual(prev: any, next: any) {
  return Object.is(prev, next)
}
