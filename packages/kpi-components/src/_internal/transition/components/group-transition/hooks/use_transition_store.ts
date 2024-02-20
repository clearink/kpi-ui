import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
import { addClassNames, delClassNames, omit } from '@kpi-ui/utils'
import { cloneElement, createElement, type ReactElement } from 'react'
import { batch, reflow } from '../../../_shared/utils'
import { ENTER, INIT, WAIT, UPDATE, FLIP, isExit, isExited } from '../../../constants'
import makeUniqueId from '../../../utils/unique_id'
import CSSTransition from '../../css-transition'
import diff from '../utils/diff'
import union from '../utils/union'

import type { CSSTransitionProps as CSS, CSSTransitionRef } from '../../css-transition/props'
import type { GroupTransitionProps as Group } from '../props'

const uniqueId = makeUniqueId('gt-')

class TransitionStore<E extends HTMLElement = HTMLElement> {
  constructor(public forceUpdate: () => void, props: Group<E>) {
    this.props = props

    this.previous = props.children

    this.current = props.children

    this.current.forEach((el) => {
      this.elements.set(el.key, { fresh: true, el: this.make(el, { when: true }) })
    })
  }

  get isCanFlip() {
    return !!(this.props.name && this.props.flip)
  }

  scheduler = {
    status: INIT,
    effect: 0,
    nextEffect: () => {
      this.scheduler.effect += 1

      this.forceUpdate()
    },
    shouldUpdate: () => this.scheduler.status === UPDATE,
    shouldWait: () => this.scheduler.status === WAIT,
    shouldFlip: () => this.scheduler.status === FLIP && this.isCanFlip,
    start: () => {
      this.scheduler.status = UPDATE

      this.scheduler.nextEffect()
    },
    update: () => {
      this.unionElements()

      this.scheduler.status = WAIT

      this.scheduler.nextEffect()
    },
    wait: () => {
      this.scheduler.status = FLIP

      this.scheduler.nextEffect()
    },
  }

  props: Group<E>

  setTransitionProps = (props: Group<E>) => {
    this.props = props
  }

  previous: ReactElement[] = []

  current: ReactElement[] = []

  elements = new Map<ReactElement['key'], { el: ReactElement<CSS>; fresh: boolean }>()

  components = new Map<ReactElement['key'], CSSTransitionRef>()

  coords = new Map<ReactElement['key'], DOMRect>()

  getCoords = () => {
    return this.previous.reduce((map, el) => {
      const comp = this.components.get(el.key)

      const rect = comp?.instance?.getBoundingClientRect()

      return rect ? map.set(el.key, rect) : map
    }, new Map<ReactElement['key'], DOMRect>())
  }

  updateCoords = () => {
    this.coords = this.getCoords()
  }

  make = (element: ReactElement, extra: Partial<CSS>) => {
    const preset = omit(this.props, ['children']) as CSS

    const ref = (instance: CSSTransitionRef | null) => {
      if (!instance) this.components.delete(element.key)
      else this.components.set(element.key, instance)
    }

    Object.assign(preset, extra, { key: uniqueId(), unmountOnExit: true, ref })

    return createElement(CSSTransition, preset, element)
  }

  runExitedEffect = () => {
    let isCompleted = true

    this.elements.forEach((_, key) => {
      const comp = this.components.get(key) || { status: ENTER }

      if (isExited(comp.status)) this.elements.delete(key)

      if (isCompleted && isExit(comp.status)) isCompleted = false
    })

    if (!isCompleted) return

    this.props.onExitComplete?.()

    this.forceUpdate()
  }

  unionElements = () => {
    const { children, onExited } = this.props

    const [enters, exits] = diff(this.current, children)

    this.elements = union(this.elements, enters, children).reduce((result, [key, el]) => {
      if (result.has(key)) throw new Error(`Encountered two children with the same key, '${key}'. `)

      if (enters.has(key)) {
        return result.set(key, { fresh: true, el: this.make(el, { when: true, appear: true }) })
      }

      const props: Partial<CSS<E>> = { onExited: batch(onExited, this.runExitedEffect) }

      if (exits.has(key)) props.when = false

      return result.set(key, { fresh: props.when !== false, el: cloneElement(el, props) })
    }, new Map())

    this.previous = this.current

    this.current = children
  }

  cancels: (() => void)[] = []

  flip = () => {
    const { name } = this.props

    this.cancels.forEach((fn) => fn())

    const moves: (() => () => void)[] = []

    this.getCoords().forEach((newCoord, key) => {
      const oldCoord = this.coords.get(key)

      const dom = (this.components.get(key) || {}).instance

      if (!oldCoord || !dom) return

      const dx = oldCoord.left - newCoord.left

      const dy = oldCoord.top - newCoord.top

      if (!dx && !dy) return

      const oldTransform = dom.style.transform
      const oldDuration = dom.style.transitionDuration

      dom.style.transform = `translate(${dx}px, ${dy}px)`
      dom.style.transitionDuration = '0s'

      moves.push(() => {
        addClassNames(dom, name && `${name}-move`)

        dom.style.transform = oldTransform
        dom.style.transitionDuration = oldDuration

        const handler = () => {
          delClassNames(dom, name && `${name}-move`)
          dom.removeEventListener('transitionend', handler)
        }

        dom.addEventListener('transitionend', handler)

        return handler
      })
    })

    reflow()

    this.cancels = moves.map((fn) => fn())
  }

  render = () => {
    const { children } = this.props

    const elements: ReactElement[] = []

    // sync elements
    this.elements.forEach((item, key) => {
      const node = children.find((el) => el.key === key)

      if (!item.fresh || !node) return elements.push(item.el)

      const element = cloneElement(item.el, undefined, node)

      elements.push(element)

      this.elements.set(key, { fresh: item.fresh, el: element })
    })

    return elements
  }
}

export default function useTransitionStore<E extends HTMLElement = HTMLElement>(props: Group<E>) {
  const forceUpdate = useForceUpdate()

  const store = useConstant(() => new TransitionStore(forceUpdate, props))

  store.setTransitionProps(props)

  return store
}
