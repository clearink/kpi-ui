import { Fragment, createElement, useEffect } from 'react'
import useSwitchChildren from './hooks/use_switch_children'
import useTransitionStore from './hooks/use_transition_store'

import type { SwitchTransitionProps } from './props'

export default function SwitchTransition(props: SwitchTransitionProps) {
  const store = useTransitionStore(props)

  useSwitchChildren(store, props)

  useEffect(() => store.setInitial(false), [store])

  let renderElement: any = store.elements

  renderElement = renderElement.length > 1 ? renderElement : renderElement[0]

  return createElement(Fragment, undefined, renderElement)
}
