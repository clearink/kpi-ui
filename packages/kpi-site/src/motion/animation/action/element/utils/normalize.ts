import { isArray, isNull, pushItem } from '@kpi/shared'
import getElementCache from './cache'

import type { AnimateElementOptions, AnimateValueOptions, KeyframeTarget } from '../../../interface'

export function normalizeTransition(
  maybeOptions: AnimateElementOptions | undefined,
  defaultOptions: AnimateValueOptions
) {
  return maybeOptions ?? defaultOptions
}

export function normalizeTarget(element: Element, property: string) {
  // to = [100, 300, '20vh', '40px', '20vw']
  // convertUnit(element, property)
  // const propertiesCache = getElementMotionCache(element)
  // const cacheMotionValue = propertiesCache.get(property)
  // // 1. normalize Target
  // // 如果已经存在 直接创建 renderer 返回
  // if (cacheMotionValue) {
  //   //
  // }
  // // const from = cacheMotionValue ? cacheMotionValue.get() : getElementProperty()
  // // const from = motionValue(0)
  return []
}

export function normalizeKeyframes(element: Element, property: string, to: KeyframeTarget) {
  const from = getElementCache(element)[property]

  const targets = isArray(to) ? to : [null, to]

  return targets.reduce((result: string[], target, i) => {
    if (!isNull(target)) return pushItem(result, target)

    return pushItem(result, i === 0 ? from : result[i - 1])
  }, [])
}

// // 获取 setter 函数
// function getAnimationType(element: Element, property: string) {
//   if (!element.nodeType) return

//   // attribute
//   if (
//     !isNullish(element.getAttribute(property)) ||
//     (element instanceof SVGElement && element[property])
//   )
//     return (value: string) => element.setAttribute(property, value)

//   // transform
//   if (transform.test(property)) {
//     return (value: string) => {
//       // 渲染 transform
//       const cache = getElementCache(element)

//       // TODO: 按照 perspective, translate3d, rotate, skew, scale 的顺序去生成数据

//       const transforms = Object.keys(motionTransformProps)

//       //   if (cache.p) transforms += `perspective(${cache.p}) `

//       //   if (cache.x || cache.y || cache.z) {
//       //     transforms = +`transform3d(${cache.x || 0},${cache.y || 0},${cache.y || 0}) `
//       //   }

//       //   if (cache.rotate) transforms += `rotate(${cache.rotate}) `

//       //   if (cache.rotateX) transforms += `rotateX(${cache.rotate}) `

//       //   if (cache.rotateY) transforms += `rotateY(${cache.rotate}) `

//       //   if (cache.rotateZ) transforms += `rotateZ(${cache.rotate}) `

//       //   if(cache.skew) transforms += `skew()`
//       //   /**
//       //    *     if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
//       //   transforms += 'skew(' + skewX + ', ' + skewY + _endParenthesis
//       // }

//       // if (scaleX !== 1 || scaleY !== 1) {
//       //   transforms += 'scale(' + scaleX + ', ' + scaleY + _endParenthesis
//       // }
//       //    */

//       //   const result = keys.map((fn) => `${fn}(${v[fn]})`).join(' ')

//       //   return hasOwn(v, 'translateZ') ? result : `${result} translateZ(0px)`
//     }
//   }

//   // css
//   const typedElement = element as Element & { style: CSSStyleDeclaration }

//   return (value: string) => typedElement.style.setProperty(property, value)
// }
