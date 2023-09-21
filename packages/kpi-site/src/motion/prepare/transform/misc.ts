/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
import { hasOwn, isNullish } from '@kpi/shared'

import type { ResolvedTransform } from '../interface'

const makeTuple = <V extends Required<ResolvedTransform>, K extends keyof V>(
  key: K,
  defaultValue: V[K]
) => {
  const setter = (resolved: V, value: V[K]) => {
    if (isNullish(value)) return resolved

    if (!hasOwn(resolved, key)) resolved[key] = defaultValue

    resolved[key] = value

    return resolved
  }
  return [defaultValue, setter] as const
}

// 符合要求有关 transform 的属性值
// p 转换成 perspective
// x 转换成 translateX
// ...

export const motionTransformProps = Object.freeze({
  p: ['perspective', '0px'],
  perspective: ['perspective', '0px'],
  x: ['translateX', '0px'],
  translateX: ['translateX', '0px'],
  y: ['translateY', '0px'],
  translateY: ['translateY', '0px'],
  z: ['translateZ', '0px'],
  translateZ: ['translateZ', '0px'],
  scale: ['scaleX', '1'],
  scaleX: ['scaleX', '1'],
  scaleY: ['scaleY', '1'],
  scaleZ: ['scaleZ', '1'],
  rotate: ['rotate', '0deg'],
  rotateX: ['rotateX', '0deg'],
  rotateY: ['rotateY', '0deg'],
  rotateZ: ['rotateZ', '0deg'],
  skew: ['skewX', '0deg'],
  skewX: ['skewX', '0deg'],
  skewY: ['skewY', '0deg'],
})

// 暂时不解析这玩意儿
// const makeInlineTransformSetter =
//   <V extends Required<ResolvedTransform>, K extends keyof V>(keys: K[]) =>
//   (resolved: V, args: V[K][]) => {
//     keys.forEach((key, i) => {
//       const setter = ((motionTransformProps as any)[key] || [])[1]
//       setter && setter(resolved, args[i])
//     })
//     return resolved
//   }

// // 转换 inline transform props
// export const inlineTransformProps = Object.freeze({
//   perspective: makeInlineTransformSetter(['perspective']),
//   translateX: makeInlineTransformSetter(['translateX']),
//   translateY: makeInlineTransformSetter(['translateY']),
//   translateZ: makeInlineTransformSetter(['translateZ']),
//   scale: makeInlineTransformSetter(['scale']),
//   scaleX: makeInlineTransformSetter(['scaleX']),
//   scaleY: makeInlineTransformSetter(['scaleY']),
//   scaleZ: makeInlineTransformSetter(['scaleZ']),
//   rotate: makeInlineTransformSetter(['rotate']),
//   rotateX: makeInlineTransformSetter(['rotateX']),
//   rotateY: makeInlineTransformSetter(['rotateY']),
//   rotateZ: makeInlineTransformSetter(['rotateZ']),
//   skew: makeInlineTransformSetter(['skewX', 'skewY']),
//   skewX: makeInlineTransformSetter(['skewX']),
//   skewY: makeInlineTransformSetter(['skewY']),

//   translate: makeInlineTransformSetter(['translateX', 'translateY']),
//   translate3d: makeInlineTransformSetter(['translateX', 'translateY', 'translateZ']),
//   scale3d: makeInlineTransformSetter(['scaleX', 'scaleY', 'scaleZ']),
// })
