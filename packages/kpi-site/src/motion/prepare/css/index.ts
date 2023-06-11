// convert css property unit
// common

export default {
  test: (element: Element, key: string) => 'style' in element && element.nodeType,

  parse: (element: Element, key: string) => {},
  transform: () => {},
}
