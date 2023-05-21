const transformProps = [
  'perspective',
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

export default {
  test: (element: Element, key: string) => {
    return transformProps.indexOf(key) !== -1
  },
}
