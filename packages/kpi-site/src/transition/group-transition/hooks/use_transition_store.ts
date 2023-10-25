import { omit, useConstant, useForceUpdate } from '@kpi/shared'
import { createElement, type Key, type ReactElement } from 'react'
import CSSTransition from '../../css-transition'
import { isEnter, isEntered } from '../../css-transition/constants/status'
import batch from '../../css-transition/utils/batch'
import { addTransitionClass } from '../../css-transition/utils/classnames'
import { addClassName, delClassName } from '../../utils/dom_helper'
import reflow from '../../utils/reflow'
import runCounter from '../../utils/run_counter'
import minus from '../utils/minus'
import union from '../utils/union'

import type { CSSTransitionProps as CSS, CSSTransitionRef } from '../../css-transition/props'
import type { GroupTransitionProps as Group } from '../props'

class TransitionStore<E extends HTMLElement = HTMLElement> {
  constructor(public forceUpdate: () => void, props: Group<E>) {
    this.props = props

    this.current = props.children

    this.elements = this.current.map((el) => this.makeElement(el, { when: true }))
  }

  props: Group<E>

  current: ReactElement[] = []

  elements: ReactElement<CSS<E>>[] = []

  // CSSTransition 实例
  components = new Map<Key | null, CSSTransitionRef<E>>()

  coords = new Map<Key | null, DOMRect>()

  isInitial = true

  setTransitionProps = (props: Group<E>) => {
    this.props = props
  }

  collectCoords = () => {
    const coords = new Map<Key | null, DOMRect>()

    this.components.forEach(({ instance }, key) => {
      instance && coords.set(key, instance.getBoundingClientRect())
    })

    return coords
  }

  makeElement = (element: ReactElement, extra: Partial<CSS>) => {
    return createElement(
      CSSTransition,
      Object.assign(omit(this.props, ['children']) as CSS, extra, {
        key: element.key,
        unmountOnExit: true,
        ref: (instance: CSSTransitionRef<E> | null) => {
          if (!instance) this.components.delete(element.key)
          else this.components.set(element.key, instance)
        },
      }),
      element
    )
  }

  runTransition = () => {
    const { children } = this.props

    this.coords = this.collectCoords()

    const enters = minus(children, this.current).map((el) => el.key)

    const exits = minus(this.current, children).map((el) => el.key)

    const onFinish = runCounter(enters.length + exits.length, () => {
      this.elements = this.current.map((el) => this.makeElement(el, { when: true }))
      this.forceUpdate()
    })

    this.elements = union(this.current, children).map((el) => {
      if (enters.includes(el.key))
        return this.makeElement(el, {
          when: true,
          appear: true,
          onEntered: batch(this.props.onEntered, onFinish),
        })

      if (exits.includes(el.key))
        return this.makeElement(el, {
          when: false,
          onExited: batch(this.props.onExited, onFinish),
        })

      return this.makeElement(el, { when: true })
    })

    console.log(this.elements)

    this.current = children

    this.forceUpdate()
  }

  runFlip = () => {
    const { name } = this.props

    const oldRects = this.coords

    this.components.forEach((_, k) => {
      const comp = this.components.get(k)

      const instance = comp && comp.instance

      if (!instance || !name) return

      delClassName(instance, `${name}-move`)
    })

    const newRects = this.collectCoords()

    const moves = new Map<Key | null, () => void>()

    oldRects.forEach((oldRect, key) => {
      const newRect = newRects.get(key)

      const comp = this.components.get(key)

      const dom = comp && comp.instance

      if (!newRect || !dom) return

      const dx = oldRect.left - newRect.left
      const dy = oldRect.top - newRect.top

      if (!dx && !dy) return

      const oldTransform = dom.style.transform
      const oldDuration = dom.style.transitionDuration

      dom.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
      dom.style.transitionDuration = '0s'

      moves.set(key, () => {
        name && addClassName(dom, `${name}-move`)
        dom.style.transform = oldTransform
        dom.style.transitionDuration = oldDuration
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
