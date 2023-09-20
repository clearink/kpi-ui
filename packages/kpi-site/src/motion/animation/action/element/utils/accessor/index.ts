import { motionTransformProps } from '../../../../../prepare/transform/misc'
import { getElementStyle, getInlineStyle } from '../../../../../prepare/utils/get_style'
import getElementCache from '../cache'
import makeAttrAccessor, { isElementAttribute } from './attr'
import makeCssAccessor from './css'
import makeTransformAccessor, { isElementTransform } from './transform'

export default function makeAccessor(element: Element, property: string) {
  const cache = getElementCache(element)

  // if (isElementTransform()) return makeTransformAccessor()

  // if (isElementAttribute()) return makeAttrAccessor()

  // return makeCssAccessor()

  if (motionTransformProps[property]) {
    // 是 transform 属性
    const get = () => {
      const current = getInlineStyle(element, property)
      // 需要一个解析 transform 的函数
      return current || 'auto'
    }
    const set = (val: string) => {}
    return { get, set }
  }

  const get = () => {
    const current = getElementStyle(element, property)
    return current || 'auto'
  }
  const set = (val: string) => {
    console.log(val)
    ;(element as HTMLElement).style.setProperty(property, val)
  }

  return { get, set }
}
