import { hasOwn } from '@kpi/shared'
import getElementCache from '../cache'

export const motionTransformProps = Object.freeze({
  p: [['perspective', '0px']],
  x: [['translateX', '0px']],
  y: [['translateY', '0px']],
  z: [['translateZ', '0px']],
  scale: [
    ['scaleX', '1'],
    ['scaleY', '1'],
  ],
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

// transform 属性比较特殊，分解矩阵后得到的也不一定是原始数据，因此放弃解析。给出默认值即可
export default function makeTransformAccessor(element: HTMLElement, property: string) {
  const cache = getElementCache(element)

  // '需要解析 transform' 的每个属性， 然后将其赋值到 cache 中

  // 设置的时候重新赋值

  const [animateName, defaultValue] = motionTransformProps[property]

  const get = () => {
    // inline.split(' ').reduce((result, str) => {
    //   const parsed = parseFunctionString(inline)
    //   if (!parsed) return result
    //   const { name, args } = parsed
    // }, [])
    // const [name, value] = motionTransformProps[property]!
    return cache[animateName]!
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
