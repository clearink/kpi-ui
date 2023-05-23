// import { getUnit } from './utils/getters'

// convert css property unit
// common

// transform

export default {
  test: (element: Element, key: string) => 'style' in element && element.nodeType,

  parse: (element: Element, key: string) => {},
  transform: () => {},
}
