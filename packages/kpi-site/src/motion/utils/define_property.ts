export function defineHidden(obj: any, key: any, value: any) {
  Object.defineProperty(obj, key, { value, configurable: true, writable: true })
}
export function defineReadonly(obj: any, p: any, value: any) {
  Object.defineProperty(obj, p, { value, configurable: true, enumerable: true })
}

export function defineGetter(obj: any, p: any, get: () => any) {
  Object.defineProperty(obj, p, { get, configurable: true, enumerable: true })
}
