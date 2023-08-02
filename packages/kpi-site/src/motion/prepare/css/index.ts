// convert css property unit
// common

export default {
  // css
  test: (element: Element) => 'style' in element && element.nodeType,

  prepare: (element: Element, key: string) => {},

  render: () => {},
}
