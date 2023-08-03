import type { AnimatableValue } from '../../../interface'
import getElementCache from './cache'

export default function createSetter(element: Element, property: string) {
  const cache = getElementCache(element)
  // 还需要根据 property 去更新样式
  // transform css attribute
  return (value: AnimatableValue) => {
    cache[property] = value
    console.log(property, value)
    // ;(element as HTMLElement).style.setProperty('transform', `translate3d(${value}, 0, 0)`)
  }
}
