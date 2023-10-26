import { omit, useConstant, useForceUpdate } from '@kpi/shared'
import { cloneElement, createElement, type Key, type ReactElement } from 'react'
import CSSTransition from '../../css-transition'
import batch from '../../css-transition/utils/batch'
import { addTransitionClass, delTransitionClass } from '../../utils/classnames'
import { addListener, addTimeout } from '../../utils/listener'
import reflow from '../../utils/reflow'
import runCounter from '../../utils/run_counter'
import makeUniqueId from '../../utils/unique_id'
import minus from '../utils/minus'
import union from '../utils/union'

import type { CSSTransitionProps as CSS, CSSTransitionRef } from '../../css-transition/props'
import type { GroupTransitionProps as Group } from '../props'

const uniqueId = makeUniqueId('-')
class TransitionStore<E extends HTMLElement = HTMLElement> {
  constructor(public forceUpdate: () => void, props: Group<E>) {
    this.props = props

    this.current = props.children

    this.elements = this.current.map((el) => {
      return [el.key, this.makeElement(el, { when: true })]
    })
  }

  props: Group<E>

  previous: ReactElement[] = []

  current: ReactElement[] = []

  // 展示的元素, GroupTransition 组件需要劫持 children 的展示逻辑
  // 对于 exits 元素, 需要插入到合适的位置
  elements: [Key | null, ReactElement<CSS>][] = []

  get keys() {
    return this.elements.map((item) => item[0])
  }

  get nodes() {
    return this.elements.map((item) => item[1])
  }

  // CSSTransition 实例
  components = new Map<Key | null, CSSTransitionRef>()

  // 因为需要得到上一次的布局信息，
  coords = new Map<Key | null, DOMRect>()

  isInitial = true

  setTransitionProps = (props: Group<E>) => {
    this.props = props
  }

  collectCoords = (keys: (Key | null)[]) => {
    const set = new Set(keys)

    const coords = new Map<Key | null, DOMRect>()

    this.components.forEach(({ instance }, key) => {
      if (!set.has(key) || !instance) return

      coords.set(key, instance.getBoundingClientRect())
    })

    return coords
  }

  makeElement = (element: ReactElement, extra: Partial<CSS>) => {
    return createElement(
      CSSTransition,
      Object.assign(omit(this.props, ['children']) as CSS, extra, {
        key: uniqueId(),
        unmountOnExit: true,
        ref: (instance: CSSTransitionRef | null) => {
          if (!instance) this.components.delete(element.key)
          else this.components.set(element.key, instance)
        },
      }),
      element
    )
  }

  runTransition = () => {
    const { keys, props, elements } = this

    const { children } = props

    // 最新的子元素 keys
    const newKeys = children.map((el) => el.key)

    // 新增元素
    const enters = minus(newKeys, keys)

    // 离开元素
    const exits = minus(keys, newKeys)

    // const onFinish = runCounter(enters.length + exits.length, () => {
    //   this.elements = this.current.map((el) => {
    //     const element = this.elements.find(([key]) => el.key === key)![1]
    //     return [el.key, element]
    //   })

    //   this.forceUpdate()
    // })

    const all = union(keys, newKeys)
    console.log('exits', exits, all)
    this.elements = union(keys, newKeys).map((key) => {
      if (enters.includes(key)) {
        const el = children.find((item) => item.key === key)!
        return [
          key,
          this.makeElement(el, {
            when: true,
            appear: true,
          }),
        ]
      }
      const element = elements.find(([k]) => k === key)![1]

      const when = !exits.includes(key)

      return [key, cloneElement(element, { when })]
    })

    // 只获取当前元素的位置信息

    this.previous = this.current

    this.coords = this.collectCoords(this.current.map((el) => el.key))

    this.current = children

    this.forceUpdate()
  }

  runFlip = () => {
    this.runCleanupHook()

    const { name } = this.props

    const oldRects = this.coords

    const newRects = this.collectCoords(this.previous.map((el) => el.key))

    const moves = new Map<Key | null, () => void>()
    // need prevChildren
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
      })
    })

    reflow()

    moves.forEach((fn) => fn())
  }

  runCleanupHook = () => {
    const { name } = this.props

    // 需要清除上次的东西
    // 还有事件处理函数等
    this.previous.forEach((el) => {
      const comp = this.components.get(el.key)
      const dom = comp && comp.instance
      dom && name && delTransitionClass(dom, `${name}-move`)
    })
  }
}

export default function useTransitionStore<E extends HTMLElement = HTMLElement>(props: Group<E>) {
  const forceUpdate = useForceUpdate()

  return useConstant(() => new TransitionStore(forceUpdate, props))
}
