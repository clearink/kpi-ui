import { isNullish } from '@kpi/shared'
import { Attr } from './interface'

export default {
  test: (element: Element, key: string) => !isNullish(element.getAttribute(key)),
  parse: (element: Element, key: string): Attr => ['attr', { [key]: element.getAttribute(key)! }],
  transform: () => {},
}
