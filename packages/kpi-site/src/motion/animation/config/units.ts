const PX =
  'translateX,translateY,translateZ,top,right,bottom,left,width,height,fontSize,padding,margin,perspective'
    .split(',')
    .reduce((result, prop) => ({ ...result, [prop]: 'px' }), {})

const DEG = 'rotate,rotateX,rotateY,rotateZ,skew,skewX,skewY'
  .split(',')
  .reduce((result, prop) => ({ ...result, [prop]: 'deg' }), {})

const VOID = 'opacity'.split(',').reduce((result, prop) => ({ ...result, [prop]: '' }), {})

export default { ...PX, ...DEG, ...VOID }

const isUnitlessNumber: { [key: string]: true } = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
}

// const prefixKey = (prefix: string, key: string) =>
//   prefix + key.charAt(0).toUpperCase() + key.substring(1)
// const prefixes = ['Webkit', 'Ms', 'Moz', 'O']

// isUnitlessNumber = Object.keys(isUnitlessNumber).reduce((acc, prop) => {
//   prefixes.forEach((prefix) => (acc[prefixKey(prefix, prop)] = acc[prop]))
//   return acc
// }, isUnitlessNumber)
