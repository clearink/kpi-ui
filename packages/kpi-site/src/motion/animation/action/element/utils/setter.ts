import type { AnimatableValue } from '../../../interface'

export default function createSetter(element: Element, property: string) {
  // 1. attribute
  // 2. transform
  // 3. style
  // // 所以需要解析 element 的类型与 property 的名称
  // if (isAttribute) {
  //   return (value: AnimatableValue) => {
  //     element.setAttribute(property, `${value}`)
  //   }
  // }

  // if (isTransform) {
  //   return (value: AnimatableValue) => {
  //     ;(element as HTMLElement).style.setProperty('transform', renderTransform())
  //   }
  // }

  // isStyle
  return (value: AnimatableValue) => {
    // 此处有疑问
    ;(element as HTMLElement).style.setProperty(property, `${value}`)
  }
}
