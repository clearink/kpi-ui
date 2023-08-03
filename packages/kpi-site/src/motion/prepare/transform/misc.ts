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
export const motionTransformProps = Object.freeze({
  p: makeTuple('perspective', 0),
  perspective: makeTuple('perspective', 0),
  x: makeTuple('translateX', 0),
  translateX: makeTuple('translateX', 0),
  y: makeTuple('translateY', 0),
  translateY: makeTuple('translateY', 0),
  z: makeTuple('translateZ', 0),
  translateZ: makeTuple('translateZ', 0),
  scale: makeTuple('scaleX', 1),
  scaleX: makeTuple('scaleX', 1),
  scaleY: makeTuple('scaleY', 1),
  scaleZ: makeTuple('scaleZ', 1),
  rotate: makeTuple('rotate', 0),
  rotateX: makeTuple('rotateX', 0),
  rotateY: makeTuple('rotateY', 0),
  rotateZ: makeTuple('rotateZ', 0),
  skew: makeTuple('skewX', 0),
  skewX: makeTuple('skewX', 0),
  skewY: makeTuple('skewY', 0),
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
