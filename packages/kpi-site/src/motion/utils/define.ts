export function defineProperty(obj: any, key: any, descriptor: PropertyDescriptor) {
  Object.defineProperty(obj, key, descriptor)
}

export function defineHidden(obj: any, key: any, value: any) {
  defineProperty(obj, key, { value, configurable: true, writable: true })
}

export function defineGetter(obj: any, key: any, get: () => any) {
  defineProperty(obj, key, { get })
}
