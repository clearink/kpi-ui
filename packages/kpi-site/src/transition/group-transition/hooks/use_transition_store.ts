import { omit, useConstant, useForceUpdate } from '@kpi/shared'
import { cloneElement, createElement, type Key, type ReactElement } from 'react'
import CSSTransition from '../../css-transition'
import batch from '../../css-transition/utils/batch'
import { addTransitionClass, delTransitionClass } from '../../utils/classnames'
import { addListener, addTimeout } from '../../utils/listener'
import reflow from '../../utils/reflow'
import runCounter from '../../utils/run_counter'
import minus from '../utils/minus'
import union from '../utils/union'
import makeUniqueId from '../../utils/unique_id'

import type { CSSTransitionProps as CSS, CSSTransitionRef } from '../../css-transition/props'
import type { GroupTransitionProps as Group } from '../props'

const uniqueId = makeUniqueId('-')
class TransitionStore<E extends HTMLElement = HTMLElement> {
  constructor(public forceUpdate: () => void, props: Group<E>) {
    this.props = props

    this.current = props.children

    this.elements = new Map(
      this.current.map((el) => {
        return [el.key, this.makeElement(el, { when: true })]
      })
    )
  }

  props: Group<E>

  previous: ReactElement[] | null = null

  current: ReactElement[] = []

  elements = new Map<Key | null, ReactElement<CSS<E>>>()
  // elements: ReactElement<CSS<E>>[] = []

  // CSSTransition 实例
  components = new Map<Key | null, CSSTransitionRef<E>>()

  // 因为需要得到上一次的布局信息，
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
        key: uniqueId(),
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

    const enters = minus(children, this.current).map((el) => el.key)

    const exits = minus(this.current, children).map((el) => el.key)

    const onFinish = runCounter(enters.length + exits.length, () => {
      this.elements = new Map(
        this.current.map((el) => {
          return [el.key, this.elements.get(el.key)!]
        })
      )
      this.forceUpdate()
    })

    this.elements = new Map(
      union(this.current, children).map((el) => {
        if (enters.includes(el.key)) {
          return [
            el.key,
            this.makeElement(el, {
              when: true,
              appear: true,
              onEntered: batch(this.props.onEntered, onFinish),
            }),
          ] as const
        }
        // 复用之前的 element
        if (exits.includes(el.key))
          return [
            el.key,
            cloneElement(this.elements.get(el.key)!, {
              when: false,
              onExited: batch(this.props.onExited, onFinish),
            }),
          ] as const

        return [
          el.key,
          cloneElement(this.elements.get(el.key)!, {
            when: true,
          }),
        ] as const
      })
    )

    // 只获取当前元素的位置信息
    this.coords = this.collectCoords()

    this.previous = this.current

    this.current = children

    console.log(this.previous, this.current)

    this.forceUpdate()
  }

  runFlip = () => {
    const { name } = this.props
    // eslint-disable-next-line no-debugger
    // debugger

    const oldRects = this.coords

    // 需要清除上次的东西
    ;(this.previous || []).forEach((el) => {
      const comp = this.components.get(el.key)
      const dom = comp && comp.instance
      dom && delTransitionClass(dom, name && `${name}-move`)
    })

    const newRects = this.collectCoords()

    const moves = new Map<Key | null, () => void>()
    // need prevChildren
    ;(this.previous || []).forEach(({ key }) => {
      const newRect = newRects.get(key)
      const oldRect = oldRects.get(key)

      const comp = this.components.get(key)

      const dom = comp && comp.instance

      if (!newRect || !dom || !oldRect) return

      const dx = oldRect.left - newRect.left
      const dy = oldRect.top - newRect.top

      if (!dx && !dy) return

      const oldTransform = dom.style.transform
      const oldDuration = dom.style.transitionDuration

      dom.style.transform = `translate(${dx}px, ${dy}px)`
      dom.style.transitionDuration = '0s'

      moves.set(key, () => {
        addTransitionClass(dom, name && `${name}-move`)
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
