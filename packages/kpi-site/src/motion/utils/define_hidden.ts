export default function defineHidden(obj: any, key: any, value: any) {
  Object.defineProperty(obj, key, { value, configurable: true, writable: true })
}
