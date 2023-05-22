import { isNumber } from '@kpi/shared'
import color from './color'

import type { AnimatableValue, ElementKeyframes } from '../animation/interface'
import type { Tween } from '../animation/tween/interface'

export const parseValueTweenTarget = <V extends AnimatableValue>(target: V[]) => {
  return target.map((item) => {
    if (isNumber(item) || !color.test(item)) return item

    return color.transform(color.parse(item)) as V
  })
}

export const parseElementTweenTarget = (element: Element, keyframes: ElementKeyframes) => {
  // Object.keys(keyframes).forEach((key) => {
  //   if (attr.test(element, key)) {
  //     // attr
  //     const from = element.getAttribute(key)!
  //     const motion = motionValue(from as V)
  //     const tween = valueTween(motion, keyframes[key], {
  //       ...options,
  //       onChange: chainedFunc(options.onChange, (current) => {
  //         console.log('current', current, key, element, 'attr')
  //       }),
  //     })
  //     tweens.push(tween)
  //   } else if (css.test(element, key)) {
  //     const from = (element as HTMLElement).style
  //     console.log(from.getPropertyValue('transform'), key)
  //     // const motion = motionValue(from as V)
  //     // const tween = valueTween(motion, keyframes[key], {
  //     //   ...options,
  //     //   onChange: chainedFunc(options.onChange, (current) => {
  //     //     console.log('current', current, key, element, 'css')
  //     //   }),
  //     // })
  //     // tweens.push(tween)
  //   }
  // })
  return []
}
