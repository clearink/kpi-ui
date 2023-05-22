const transformProps = [
  'p', // transform perspective 区分 css perspective
  'x',
  'y',
  'z',
  'translateX',
  'translateY',
  'translateZ',
  'scale',
  'scaleX',
  'scaleY',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'skew',
  'skewX',
  'skewY',
]

const set = new Set(transformProps)

export default {
  test: (key: string) => set.has(key),
  parse: (element: Element, key: string) => {},
  transform: () => {},
}
