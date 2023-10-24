import { isUndefined, useDerivedState } from '@kpi/shared'
import { createElement, Fragment } from 'react'
import useTransitionStore from './hooks/use_transition_store'
import { isElementsEqual } from '../utils/equal'

import type { GroupTransitionProps } from './props'

export default function GroupTransition<E extends HTMLElement = HTMLElement>(
  props: GroupTransitionProps<E>
) {
  const { children } = props

  const store = useTransitionStore(props)

  store.setTransitionProps(props)

  const shouldTransition = !isElementsEqual(store.current, children)

  useDerivedState(shouldTransition, () => {
    if (!shouldTransition) return

    store.forceUpdate()

    const enters = diff(children, store.current).map((el) => el.key)
    const exits = diff(store.current, children).map((el) => el.key)
    const moves = inter(store.current, children).map((el) => el.key)

    store.current = children

    store.elements = union(store.current, children).map((el) => {
      if (exits.includes(el.key)) return store.makeElement(el, { when: false })

      if (enters.includes(el.key)) return store.makeElement(el, { when: true, appear: true })

      return store.makeElement(el, { when: true })
    })
  })

  console.log(store.elements.map((el) => el.key))
  return createElement(Fragment, undefined, store.elements)
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
