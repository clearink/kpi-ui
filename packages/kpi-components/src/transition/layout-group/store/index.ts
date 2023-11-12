import { isNullish, logger } from '@kpi-ui/utils'
import { CSSTransitionRef } from '../../css-transition/props'
import isCoords from '../utils/is_coords'

export default class LayoutTransitionStore {
  map = new Map<string, DOMRect>()

  // 注册
  register = (store: CSSTransitionRef<any> | null, id: string) => {
    const instance = store && (store.instance as HTMLElement | null)

    if (!instance) return

    this.map.set(id, instance.getBoundingClientRect())
    // console.log('register', instance.getBoundingClientRect())
  }

  exist = (id: string) => {
    return this.map.has(id)
  }

  coords(id: string) {
    const value = this.map.get(id)
    return value

    // if (isCoords(value)) return value

    // logger(!isNullish(value), `LayoutTransition id prop repeat id \`${id}\``)

    // return null
  }
}
