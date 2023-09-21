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
const PI_2 = Math.PI * 2
const RAD_TO_DEG = 180 / Math.PI

//  解析 matrix
function parseTransformMatrix(input: string) {
  const matched = parseFunctionString(input)

  const isMatrix3d = matched && matched.name === 'matrix3d'

  const matrix = matched ? matched.args.map(Number) : [1, 0, 0, 1, 0, 0]

  if (isMatrix3d) {
  } else {
    // matrix2d
    const [a, b, c, d, x, y] = matrix

    let scaleX = Math.sqrt(a * a + b * b)
    let scaleY = Math.sqrt(c * c + d * d)

    let skewX = -Math.atan2(-c, d)
    let skewY = Math.atan2(b, a)

    const delta = Math.abs(skewX + skewY)

    let rotate = 0
    if (asEqual(delta, 0) || asEqual(Math.abs(Math.PI * 2 - delta), 0)) {
      rotate = skewY * RAD_TO_DEG
      skewX = 0
      skewY = 0
    } else {
      rotate = 0
      skewX *= RAD_TO_DEG
      skewY *= RAD_TO_DEG
    }
    if (skewX) scaleY *= Math.abs(Math.cos(skewX * RAD_TO_DEG))

    rotate = sanitize(rotate)
    skewX = sanitize(skewX)
    skewY = sanitize(skewY)
    scaleX = sanitize(scaleX)
    scaleY = sanitize(scaleY)

    let result = ''

    if (x || y) result += `translate3d(${x}px, ${y}px, 0) `

    if (rotate) result += `rotate(${rotate}deg) `

    if (scaleX || scaleY) result += `scale(${scaleX}, ${scaleY}) `

    if (skewX || skewY) result += `skew(${skewX}deg, ${skewY}deg) `

    console.log(result)
  }
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

;`
javascript function parseMatrix(matrix) { 
  // 去掉matrix()函数和空格，只保留参数 
  matrix = matrix.replace(/^matrix\(/i, '').replace(/\)$/, ''); 
  // 将参数拆分成数组 
  var matrixArray = matrix.split(','); 
  // 获取矩阵的各个值 
  var a = parseFloat(matrixArray[0]); 
  var b = parseFloat(matrixArray[1]); 
  var c = parseFloat(matrixArray[2]); 
  var d = parseFloat(matrixArray[3]); 
  var e = parseFloat(matrixArray[4]); 
  var f = parseFloat(matrixArray[5]); 
  // 计算平移、缩放、旋转和倾斜的值 
  var translateX = e; 
  var translateY = f; 
  var scaleX = Math.sqrt(a * a + b * b); 
  var scaleY = Math.sqrt(c * c + d * d); 
  var rotate = Math.atan2(b, a) * (180 / Math.PI); 
  var skewX = Math.atan2(-c, d) * (180 / Math.PI); 
  var skewY = Math.atan2(b, a) * (180 / Math.PI); // 返回解析后的属性 return { translateX: translateX, translateY: translateY, scaleX: scaleX, scaleY: scaleY, rotate: rotate, skewX: skewX, skewY: skewY }; } // 示例用法 var matrix = 'matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)'; var parsedMatrix = parseMatrix(matrix); console.log(parsedMatrix.translateX); // 输出: 0 console.log(parsedMatrix.translateY); // 输出: 0 console.log(parsedMatrix.scaleX); // 输出: 1 console.log(parsedMatrix.scaleY); // 输出: 1 console.log(parsedMatrix.rotate); // 输出: 45 console.log(parsedMatrix.skewX); // 输出: -45 console.log(parsedMatrix.skewY); // 输出: 45 `
