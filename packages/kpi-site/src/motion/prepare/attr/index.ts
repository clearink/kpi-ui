import { isNullish } from '@kpi/shared'

export default {
  test: (element: Element, key: string) => !isNullish(element.getAttribute(key)),
  parse: (element: Element, key: string) => ['attr', { [key]: element.getAttribute(key)! }],
  transform: () => {},
}
