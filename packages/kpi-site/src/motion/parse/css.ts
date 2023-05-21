// import { getUnit } from './utils/getters'

// convert css property unit
// common

// transform

export default {
  test: (element: Element, key: string) => {
    if (!('style' in element)) return false
    const styles = element.style as CSSStyleDeclaration
    return true
  },
}
