import { isUndefined, omit, useConstant, useForceUpdate } from '@kpi/shared'
import { Children, cloneElement, createElement, ReactElement } from 'react'
import CSSTransition from '../../css-transition'
import mergeRefs from '../../css-transition/utils/merge_refs'
import makeUniqueId from '../../utils/unique_id'

import type { CSSTransitionProps as CSS } from '../../css-transition/props'
import type { GroupTransitionProps as Group } from '../props'

const uniqueId = makeUniqueId('group-transition-key')
class TransitionStore<E extends HTMLElement = HTMLElement> {
  constructor(public forceUpdate: () => void, props: Group<E>) {
    this.props = props

    this.current = props.children

    this.elements = this.current.map((el) => this.makeElement(el, { when: true }))
  }

  props: Group<E>

  current: ReactElement[] = []

  elements: ReactElement<CSS<E>>[] = []

  setTransitionProps = (props: Group<E>) => {
    this.props = props
  }

  makeElement = (element: JSX.Element, extra: Partial<CSS<E>>) => {
    const preset = omit(this.props, ['children']) as CSS<E>

    Object.assign(preset, extra, { key: uniqueId() })

    return createElement(CSSTransition<E>, preset, element)
  }

  runTransition = () => {
    const { children } = this.props

    const enters = diff(children, this.current).map((el) => el.key)
    const exits = diff(this.current, children).map((el) => el.key)
    const moves = inter(this.current, children).map((el) => el.key)

    const all = union(this.current, children)

    this.current = children

    this.elements = all.map((el) => {
      // 之前遗留的数据
      if (exits.includes(el.key)) {
        return this.elements.find((ele) => ele.key === el.key)!
      }

      // 需要新增的数据
      if (enters.includes(el.key)) return this.makeElement(el, { when: true, appear: true })

      return this.makeElement(el, { when: true })
    })
  }
}

export default function useTransitionStore<E extends HTMLElement = HTMLElement>(props: Group<E>) {
  const forceUpdate = useForceUpdate()

  return useConstant(() => {
    return new TransitionStore(forceUpdate, props)
  })
}

// 交集
const inter = (a: JSX.Element[], b: JSX.Element[]) => {
  const set = new Set(a.map((el) => el.key))

  return b.filter((el) => set.has(el.key))
}

// a 相对于 b 的差集 （a有但是b没有）
const diff = (a: JSX.Element[], b: JSX.Element[]) => {
  const set = new Set(b.map((el) => el.key))
  return a.filter((el) => !set.has(el.key))
}

// 并集 二者相加并去重
const union = (a: JSX.Element[], b: JSX.Element[]) => {
  const map = new Map(b.map((el, i) => [el.key, i]))

  let maxIndex = 0

  return a.reduce((result, el) => {
    const index = map.get(el.key)

    if (isUndefined(index)) result.splice(++maxIndex, 0, el)
    else maxIndex = Math.max(index, maxIndex)

    return result
  }, b.concat())
}

// 问题 如何将 exit 元素插入到最适合的位置呢？
