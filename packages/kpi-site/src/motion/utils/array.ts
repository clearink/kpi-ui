/* eslint-disable no-bitwise */
import { toArray } from '@kpi/shared'

// TODO: 移动到 @kpi/shared
export function pushItem<T>(array: T[], items: T | T[], unique = false) {
  const arrayItems = toArray(items)

  for (let i = 0; i < arrayItems.length; i += 1) {
    const item = arrayItems[i]
    if (!unique || !~array.indexOf(item)) array.push(item)
  }

  return array
}

export function removeItem<T>(array: T[], value: T) {
  const index = array.indexOf(value)
  index >= 0 && array.splice(index, 1)
}

// const keyframes = [
//   { translateX: [0, 250], duration: 300, a: 3, b: 4 },
//   { translateY: [0, 250], duration: 400, delay: 1000 },
//   { translateZ: [0, 250], duration: 500, delay: 2000 },
// ]

// const a = keyframes
//   .map((key) => Object.keys(key))
//   .flat(Infinity)
//   .reduce((result: string[], key) => {
//     // if (!is.key(key)) return result
//     return pushItem(result, key, true)
//   }, [])

// interface Nothing {}
// export type LiteralUnion<T, U> = T | (U & Nothing)

// type TweenProperty = Record<string, Record<LiteralUnion<'value', string>, any>[]>

// // ['translateX', 'translateY', 'translateZ']
// a.reduce((result, prop) => {
//   // eslint-disable-next-line no-param-reassign
//   result[prop] = keyframes.map((item) => {
//     const picked = {} as Record<LiteralUnion<'value', string>, any>
//     Object.entries(item).forEach(([key, value]) => {
//       const animatable = is.key(key)
//       if (animatable && key === prop) picked.value = value
//       else if (!animatable) picked[key] = value
//     })
//     return picked
//   })
//   return result
// }, {} as TweenProperty)

// const ppp = {
//   a: [{ value: 3 }, { duration: 400, delay: 1000 }, { duration: 500, delay: 2000 }],
//   b: [{ value: 4 }, { duration: 400, delay: 1000 }, { duration: 500, delay: 2000 }],
// }
// const normalizePropertyTween = (original: any, options?: any) => {
//   // shallow merge options
//   if (original is array){
//     const isFromTo = original.length === 2 && original[0] is not object
//     if(isFromTo){
//       prop = {value:prop}
//     }else{
//       calc tween duration
//     }
//   }
//   // add delay and endDelay to each item
// }

// function normalizeTweens(){

// }
