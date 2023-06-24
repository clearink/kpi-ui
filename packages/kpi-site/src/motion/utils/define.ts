export function defineProperty(obj: any, key: any, descriptor: PropertyDescriptor) {
  Object.defineProperty(obj, key, descriptor)
}
export function defineHidden(obj: any, key: any, value: any) {
  defineProperty(obj, key, { value, configurable: true, writable: true })
}
