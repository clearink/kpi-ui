import { isNullish, omit, useConstant, useForceUpdate } from '@kpi/shared'
import { Key, ReactElement, Ref, cloneElement, createElement } from 'react'
import CSSTransition from '../../css-transition'
import minus from '../utils/minus'
import union from '../utils/union'

import type { CSSTransitionProps as CSS } from '../../css-transition/props'
import type { GroupTransitionProps as Group } from '../props'
import inter from '../utils/inter'
import runCounter from '../../utils/run_counter'
import batch from '../../css-transition/utils/batch'
import mergeRefs from '../../css-transition/utils/merge_refs'
import { nextFrame, nextTick } from '../../utils/tick'
import reflow from '../../css-transition/utils/reflow'

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

  setTransitionProps = (props: Group<E>) => {
    this.props = props
  }

  makeElement = (element: JSX.Element, extra: Partial<CSS<E>>) => {
    const preset = omit(this.props, ['children']) as CSS<E>

    const { key } = element

    Object.assign(preset, extra, { unmountOnExit: true, key })

    const cloned = cloneElement(element, {
      ref: mergeRefs((element as any).ref, (el: E | null) => {
        el ? this.doms.set(key, el) : this.doms.delete(key)
      }),
    })

    return createElement(CSSTransition<E>, preset, cloned)
  }

  runTransition = () => {
    const { children } = this.props

    const enters = minus(children, this.current).map((el) => el.key)
    const exits = minus(this.current, children).map((el) => el.key)
    const moves = inter(this.current, children).map((el) => el.key)

    this.runFlip(moves)

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

      // moves FLIP
      return this.makeElement(el, { when: true })
    })

    this.current = children
  }

  runFlip = (moves: (Key | null)[]) => {
    const keys = moves.filter((key) => this.doms.has(key))

    const prev = keys.map((key) => this.doms.get(key)!.getBoundingClientRect())
    console.log('prev', prev)
    nextTick(() => {
      keys.forEach((key, i) => {
        const dom = this.doms.get(key)!
        const prevRect = prev[i]
        const currRect = dom.getBoundingClientRect()
        console.log(prevRect, currRect)
        const x = prevRect.left - currRect.left
        const y = prevRect.top - currRect.top

        const str = dom.style.transform
        dom.style.transform = `${str} translate(${x}px,${y}px)`
        console.log(dom)
        dom.classList.add('fade-move')
        reflow(dom)
      })
    })
  }

  cleanup = null

  runCleanup = () => {
    return this.cleanup
  }
}

export default function useTransitionStore<E extends HTMLElement = HTMLElement>(props: Group<E>) {
  const forceUpdate = useForceUpdate()

  return useConstant(() => new TransitionStore(forceUpdate, props))
}
