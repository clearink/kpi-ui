import { isNullish } from '@kpi/shared'

// convert svg attr
export default {
  test: (element: Element, key: string) => !isNullish(element.getAttribute(key)),
}
