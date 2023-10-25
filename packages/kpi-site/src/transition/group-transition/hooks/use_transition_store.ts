import { omit, pushItem, useConstant, useForceUpdate } from '@kpi/shared'
import { cloneElement, createElement, Ref, type Key, type ReactElement } from 'react'
import CSSTransition from '../../css-transition'
import batch from '../../css-transition/utils/batch'
import mergeRefs from '../../css-transition/utils/merge_refs'
import reflow from '../../utils/reflow'
import { addClassName } from '../../utils/dom_helper'
import runCounter from '../../utils/run_counter'
import minus from '../utils/minus'
import union from '../utils/union'

import type { CSSTransitionProps as CSS } from '../../css-transition/props'
import type { GroupTransitionProps as Group } from '../props'
import { isEnter } from '../../css-transition/constants/status'

const getCoords = () => {}

class TransitionStore<E extends HTMLElement = HTMLElement> {
  constructor(public forceUpdate: () => void, props: Group<E>) {
    this.props = props

    this.current = props.children

    this.elements = this.current.map((el) => this.makeElement(el, { when: true }))
  }

  props: Group<E>

  current: ReactElement[] = []

  elements: ReactElement<CSS<E>>[] = []

  doms = new Map<Key | null, E>()

  coords = new Map<Key | null, DOMRect>()

  isInitial = true

  setTransitionProps = (props: Group<E>) => {
    this.props = props
  }

  collectCoords = () => {
    const coords = new Map<Key | null, DOMRect>()

    this.doms.forEach((dom, key) => {
      coords.set(key, dom.getBoundingClientRect())
    })

    return coords
  }

  makeElement = (element: ReactElement, extra: Partial<CSS<E>>) => {
    const preset = omit(this.props, ['children']) as CSS<E>

    const { key, ref } = element as ReactElement & { ref: Ref<E> }

    Object.assign(preset, extra, { unmountOnExit: true, key })

    const cloned = cloneElement(element, {
      ref: mergeRefs(ref, (el: E | null) => {
        el ? this.doms.set(key, el) : this.doms.delete(key)
      }),
    })

    return createElement(CSSTransition<E>, preset, cloned)
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

    this.current = children

    this.forceUpdate()
  }

  runFlip = () => {
    const { name } = this.props

    const newRects = this.collectCoords()

    const oldRects = this.coords

    const moves: (() => void)[] = []

    console.log(oldRects)

    oldRects.forEach((oldRect, key) => {
      const newRect = newRects.get(key)
      const dom = this.doms.get(key)

      if (!newRect || !dom) return

      const dx = oldRect.left - newRect.left
      const dy = oldRect.top - newRect.top

      if (!dx && !dy) return

      const oldTransform = dom.style.transform
      const oldDuration = dom.style.transitionDuration

      dom.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
      dom.style.transitionDuration = '0s'

      moves.push(() => {
        addClassName(dom, name && `${name}-move`)
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
