import { useConstant, useForceUpdate } from '@kpi-ui/hooks'
import { omit } from '@kpi-ui/utils'
import { cloneElement, createElement, type Key, type ReactElement } from 'react'
import { ENTER, isExit, isExited } from '../../constants/status'
import CSSTransition from '../../css-transition'
import batch from '../../utils/batch'
import { addTransitionClass, delTransitionClass } from '../../utils/classnames'
import reflow from '../../utils/reflow'
import makeUniqueId from '../../utils/unique_id'
import diff from '../utils/diff'
import shouldFlip from '../utils/should'
import union from '../utils/union'

import type { CSSTransitionProps as CSS, CSSTransitionRef } from '../../css-transition/props'
import type { GroupTransitionProps as Group } from '../props'

const uniqueId = makeUniqueId('gt-')

class TransitionStore<E extends HTMLElement = HTMLElement> {
  constructor(public forceUpdate: () => void, props: Group<E>) {
    this.props = props

    this.previous = props.children

    this.current = props.children

    this.current.forEach((el) => this.elements.set(el.key, this.make(el, { when: true })))

    this.nodes = Array.from(this.elements.values())
  }

  props: Group<E>

  setTransitionProps = (props: Group<E>) => {
    this.props = props
  }

  previous: ReactElement[] = []

  current: ReactElement[] = []

  // 展示用
  nodes: ReactElement<CSS>[] = []

  elements = new Map<Key | null, ReactElement<CSS>>()

  components = new Map<Key | null, CSSTransitionRef>()

  coords = new Map<Key | null, DOMRect>()

  getCoords = () => {
    return this.previous.reduce((map, el) => {
      const comp = this.components.get(el.key)

      const instance = comp && comp.instance

      const rect = instance && instance.getBoundingClientRect()

      return rect ? map.set(el.key, rect) : map
    }, new Map<Key | null, DOMRect>())
  }

  updateCoords = () => {
    this.coords = this.getCoords()
  }

  isInitial = true

  setIsInitial = (isInitial: boolean) => {
    this.isInitial = isInitial
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

    this.nodes = Array.from(this.elements.values())

    if (!isCompleted) return

    const { onExitComplete } = this.props

    onExitComplete && onExitComplete()

    this.forceUpdate()
  }

  runTransition = () => {
    const { children, onExited } = this.props

    const [enters, exits] = diff(this.current, children)

    this.elements = union(this.elements, enters, children).reduce((result, [key, el]) => {
      if (result.has(key)) throw new Error(`Encountered two children with the same key, '${key}'. `)

      if (enters.has(key)) return result.set(key, this.make(el, { when: true, appear: true }))

      const props: Partial<CSS> = { onExited: batch(onExited, this.runExitedEffect) }

      if (exits.has(key)) props.when = false

      return result.set(key, cloneElement(el, props))
    }, new Map())

    this.nodes = Array.from(this.elements.values())

    this.previous = this.current

    this.current = children

    this.forceUpdate()
  }

  cancels: (() => void)[] = []

  runFlip = () => {
    const { name, moveClass } = this.props

    const cls = moveClass || (name && `${name}-move`)

    const store = this.components.get((this.previous[0] || {}).key)

    if (!shouldFlip(cls, (store || {}).instance)) return

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
        addTransitionClass(dom, cls)

        dom.style.transform = oldTransform
        dom.style.transitionDuration = oldDuration

        const handler = () => {
          delTransitionClass(dom, cls)
          dom.removeEventListener('transitionend', handler)
        }

        dom.addEventListener('transitionend', handler)

        return handler
      })
    })

    reflow()

    this.cancels = moves.map((fn) => fn())
  }
}

export default function useTransitionStore<E extends HTMLElement = HTMLElement>(props: Group<E>) {
  const forceUpdate = useForceUpdate()

  return useConstant(() => new TransitionStore(forceUpdate, props))
}
