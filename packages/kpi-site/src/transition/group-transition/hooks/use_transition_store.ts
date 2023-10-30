import { omit, pushItem, useConstant, useForceUpdate } from '@kpi/shared'
import { cloneElement, createElement, type Key, type ReactElement } from 'react'
import { ENTER, isExit, isExited } from '../../constants/status'
import CSSTransition from '../../css-transition'
import batch from '../../css-transition/utils/batch'
import { addTransitionClass, delTransitionClass } from '../../utils/classnames'
import { addListener, addTimeout } from '../../utils/listener'
import reflow from '../../utils/reflow'
import runCounter from '../../utils/run_counter'
import makeUniqueId from '../../utils/unique_id'
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
      this.elements.set(el.key, this.makeElement(el, { when: true }))
    })

    this.nodes = Array.from(this.elements.values())
  }

  props: Group<E>

  previous: ReactElement[] = []

  current: ReactElement[] = []

  // 展示用
  nodes: ReactElement<CSS>[] = []

  elements = new Map<Key | null, ReactElement<CSS>>()

  components = new Map<Key | null, CSSTransitionRef>()

  coords = new Map<Key | null, DOMRect>()

  isInitial = true

  syncTransitionProps = (props: Group<E>) => {
    this.props = props
  }

  collectCoords = () => {
    const set = new Set(this.previous.map((el) => el.key))

    const coords = new Map<Key | null, DOMRect>()

    this.components.forEach(({ instance }, key) => {
      if (!set.has(key) || !instance) return

      coords.set(key, instance.getBoundingClientRect())
    })

    return coords
  }

  makeElement = (element: ReactElement, extra: Partial<CSS>) => {
    const preset = omit(this.props, ['children']) as CSS

    const ref = (instance: CSSTransitionRef | null) => {
      if (!instance) this.components.delete(element.key)
      else this.components.set(element.key, instance)
    }

    Object.assign(preset, extra, { key: uniqueId(), unmountOnExit: true, ref })

    return createElement(CSSTransition, preset, element)
  }

  onExitedEffect = () => {
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
      if (enters.has(key))
        return result.set(key, this.makeElement(el, { when: true, appear: true }))

      const props: Partial<CSS> = { onExited: batch(onExited, this.onExitedEffect) }

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
    this.cancels.forEach((fn) => fn())
    this.cancels.length = 0

    const { name, moveClass } = this.props

    const moves = new Map<Key | null, () => void>()

    // TODO: 优化 flip 逻辑
    this.collectCoords().forEach((newCoord, key) => {
      const oldCoord = this.coords.get(key)

      if (!oldCoord) return

      const comp = this.components.get(key)

      const dom = comp && comp.instance

      const dx = oldCoord.left - newCoord.left

      const dy = oldCoord.top - newCoord.top

      if (!dom || (!dx && !dy)) return

      const oldTransform = dom.style.transform
      const oldDuration = dom.style.transitionDuration

      dom.style.transform = `translate(${dx}px, ${dy}px)`
      dom.style.transitionDuration = '0s'

      moves.set(key, () => {
        addTransitionClass(dom, name && `${name}-move`)
        dom.style.transform = oldTransform
        dom.style.transitionDuration = oldDuration
        const cb = () => {
          delTransitionClass(dom, name && `${name}-move`)
          dom.removeEventListener('transitionend', cb)
        }
        dom.addEventListener('transitionend', cb)
      })

      // TODO: 完善 cancels 逻辑
      this.cancels.push(() => {
        delTransitionClass(dom, name && `${name}-move`)
      })
    })

    reflow()

    moves.forEach((fn) => fn())
  }
}

export default function useTransitionStore<E extends HTMLElement = HTMLElement>(props: Group<E>) {
  const forceUpdate = useForceUpdate()

  return useConstant(() => new TransitionStore(forceUpdate, props))
}
