import { motionTransformProps } from '../../../../../prepare/transform/misc'
import { getElementStyle, getInlineStyle } from '../../../../../prepare/utils/get_style'
import getElementCache from '../cache'
import makeAttrAccessor, { isElementAttribute } from './attr'
import makeCssAccessor from './css'
import makeTransformAccessor, { isElementTransform } from './transform'

export default function makeAccessor(element: HTMLElement, property: string) {
  const cache = getElementCache(element)

  if (isElementTransform(property)) return makeTransformAccessor(element, property)

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
