import { hasOwn } from '@kpi/shared'
import { getInlineStyle } from '../../../../../prepare/utils/get_style'
import parseFunctionString from '../../../../../prepare/utils/parse_function_string'
import asEqual from '../../../../../utils/as_equal'
import sanitize from '../../../../../utils/sanitize'
import getElementCache from '../cache'

export const motionTransformProps = Object.freeze({
  p: [['perspective', '0px']],
  perspective: [['perspective', '0px']],
  x: [['translateX', '0px']],
  translate: [[]],
  translateX: [['translateX', '0px']],
  y: [['translateY', '0px']],
  translateY: [['translateY', '0px']],
  z: [['translateZ', '0px']],
  translateZ: [['translateZ', '0px']],
  scale: [['scaleX', '1']],
  scaleX: [['scaleX', '1']],
  scaleY: [['scaleY', '1']],
  scaleZ: [['scaleZ', '1']],
  rotate: [['rotate', '0deg']],
  rotateX: [['rotateX', '0deg']],
  rotateY: [['rotateY', '0deg']],
  rotateZ: [['rotateZ', '0deg']],
  skew: [['skewX', '0deg']],
  skewX: [['skewX', '0deg']],
  skewY: [['skewY', '0deg']],
})

// 弧度变角度
const PI_HALF = Math.PI / 2
const RAD_TO_DEG = 180 / Math.PI

// 分解 matrix
function decomposeMartix(input: string) {
  const matched = parseFunctionString(input)

  const isMatrix3d = matched && matched.name === 'matrix3d'

  const matrix = matched ? matched.args.map(parseFloat) : [1, 0, 0, 1, 0, 0]

  if (isMatrix3d) return decomposeMatrix3d(matrix)

  return decomposeMatrix2d(matrix)
}

// matrix2d QR
function decomposeMatrix2d(matrix: number[]) {
  const [a, b, c, d, x, y] = matrix

  const delta = a * d - b * c

  let rotate = 0
  let scaleX = 0
  let scaleY = 0
  let skewX = 0

  if (a || b) {
    const r = Math.sqrt(a * a + b * b)
    rotate = Math.acos(a / r) * (b > 0 ? 1 : -1)
    scaleX = r
    scaleY = delta / r
    skewX = Math.atan((a * c + b * d) / (r * r))
  } else if (c || d) {
    const s = Math.sqrt(c * c + d * d)
    rotate = PI_HALF - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s))
    scaleX = delta / s
    scaleY = s
    skewX = Math.atan((a * c + b * d) / (s * s))
  }

  rotate = sanitize(rotate * RAD_TO_DEG)
  scaleX = sanitize(scaleX)
  scaleY = sanitize(scaleY)
  skewX = sanitize(skewX * RAD_TO_DEG)

  let result = ''

  if (x || y) result += `translate3d(${x}px, ${y}px, 0) `

  if (rotate) result += `rotate(${rotate}deg) `

  if (scaleX !== 1 || scaleY !== 1) result += `scale(${scaleX}, ${scaleY}) `

  if (skewX) result += `skew(${skewX}deg)`

  return result
}

function decomposeMatrix3d(matrix: number[]) {
  const x = matrix[12]
  const y = matrix[13]
  const z = matrix[14]

  let result = ''

  if (x || y || z) result += `translate3d(${x}px, ${y}px, ${z}px) `

  return result
}

export default function makeTransformAccessor(element: HTMLElement, property: string) {
  const cache = getElementCache(element)

  // '需要解析 transform' 的每个属性， 然后将其赋值到 cache 中

  // 设置的时候重新赋值

  const [animateName, defaultValue] = motionTransformProps[property]

  const get = () => {
    const inline = getInlineStyle(element, 'transform') || ''
    // inline.split(' ').reduce((result, str) => {
    //   const parsed = parseFunctionString(inline)
    //   if (!parsed) return result
    //   const { name, args } = parsed
    // }, [])
    // const [name, value] = motionTransformProps[property]!
    console.log('inline', inline)
    return inline
  }
  const set = (value: string) => {
    cache[animateName] = value

    element.style.setProperty('transform', renderTransformStyle(cache))
  }

  return { get, set }
}

function renderTransformStyle(cache: Partial<Record<string, string>>) {
  const { translateX, translateY, translateZ } = cache
  let result = ''
  if (translateX !== '0px' || translateY !== '0px' || translateZ !== '0px') {
    result += `translate3d(${translateX}, ${translateY}, ${translateZ})`
  }

  return result
}

export function isElementTransform(property: string) {
  return hasOwn(motionTransformProps, property)
}
