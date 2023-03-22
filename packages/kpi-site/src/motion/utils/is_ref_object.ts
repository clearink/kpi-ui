import { hasOwn, isObject } from '@kpi/shared'

export default function isRefObject(obj: any) {
  return isObject(obj) && hasOwn(obj, 'current')
}
