export function shallowUnequal(prev: any, next: any) {
  return !Object.is(prev, next)
}
