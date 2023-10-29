import { omit, pushItem, useConstant, useForceUpdate } from '@kpi/shared'
import { cloneElement, createElement, type Key, type ReactElement } from 'react'
import { isExited } from '../../constants/status'
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

    this.elements = this.current.reduce((result, el) => {
      return result.set(el.key, this.makeElement(el, { when: true }))
    }, new Map())

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

  runTransition = () => {
    const { children, onExited } = this.props

    const [enters, exits] = diff(this.current, children)

    const onFinish = runCounter(enters.size + exits.size, () => {
      // 拿到最新值
      const { onExitComplete } = this.props

      this.elements.forEach((_, key) => {
        const comp = this.components.get(key)
        if (comp && !isExited(comp.status)) return
        this.elements.delete(key)
      })

      this.nodes = Array.from(this.elements.values())

      onExitComplete && onExitComplete()

      this.forceUpdate()
    })

    this.elements = union(this.elements, enters, children).reduce((result, [key, el]) => {
      if (enters.has(key)) {
        const element = this.makeElement(el, { when: true, appear: true })
        return result.set(key, element)
      }

      // 清空回调函数
      if (!exits.has(key)) return result.set(key, cloneElement(el, { onExited }))

      const element = cloneElement(el, { when: false, onExited: batch(onExited, onFinish) })
      return result.set(key, element)
    }, new Map())

    this.nodes = Array.from(this.elements.values())

    // 只获取当前元素的位置信息

    this.previous = this.current

    this.current = children

    this.forceUpdate()
  }

  cancels: (() => void)[] = []

  runFlip = () => {
    this.cancels.forEach((fn) => fn())
    this.cancels.length = 0

    const { name, moveClass } = this.props

    // TODO: 检查 moveClass 是否生效
    const oldRects = this.coords

    const newRects = this.collectCoords()

    const moves = new Map<Key | null, () => void>()

    // TODO: 优化 flip 逻辑
    this.previous.forEach(({ key }) => {
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
