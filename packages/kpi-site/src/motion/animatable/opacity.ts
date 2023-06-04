/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import { getElementStyle } from '../parse/utils/get_style'
import { getElementCache } from '../utils/cache'
import clamp from '../utils/clamp'

import Renderer from './renderer'

const transform = {
  test: (element: Element, property: string) => property === 'opacity',
  parse: (element: Element) => getElementStyle(element, 'opacity'),
  render: (element: HTMLElement & SVGElement) => {
    const cache = getElementCache(element)
    cache.forEach((motion, property) => {
      // if (!transform.test(element, property)) return
    })
    const value = Math.random() * 2
    element.style.opacity = `${clamp(value, 0, 1)}`
  },
}
/**
 * 1. 属性值
 * 2. 单位
 * 3. 默认值
 * 4. 名称
 */
export default class Transform extends Renderer {
  public readonly name = 'transform'

  protected properties = ['p', 'x', 'y', 'z']

  public test = (property: string) => {
    return this.properties.includes(property)
  }
}

export class Opacity extends Renderer {
  public readonly name = 'opacity'

  public test = (property: string) => {
    return this.name === property
  }

  public render = (element: HTMLElement | SVGElement) => {
    const cache = getElementCache(element)

    const defaultValue = 1

    const current = cache.get(this.name)?.get() ?? defaultValue

    const clamped = clamp(+current, 0, 1)

    element.style[this.name] = `${clamped}`
  }
}
