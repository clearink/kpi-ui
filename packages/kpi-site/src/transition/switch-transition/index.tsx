import { Fragment, createElement, useRef, Key, ReactElement, Children, isValidElement } from 'react'
import useSwitchChildren from './hooks/use_switch_children'
import useTransitionStore from './hooks/use_transition_store'

import type { SwitchTransitionProps } from './props'

// 转场动画
export default function SwitchTransition(props: SwitchTransitionProps) {
  const { children } = props

  const store = useTransitionStore(props)

  const allElements: ReactElement[] = []

  Children.forEach(children, (child) => {
    if (isValidElement(child)) allElements.push(child)
  })

  const renderElements = useRef(new Map())

  // useRef(new Map<Key, ReactElement>())
  useSwitchChildren(store, props)

  return createElement(Fragment, undefined, store.elements)
}
