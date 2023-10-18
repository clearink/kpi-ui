import { Fragment, createElement } from 'react'
import useSwitchChildren from './hooks/use_switch_children'
import useTransitionStore from './hooks/use_transition_store'

import type { SwitchTransitionProps } from './props'

export default function SwitchTransition(props: SwitchTransitionProps) {
  const store = useTransitionStore(props)

  useSwitchChildren(store, props)

  return createElement(Fragment, undefined, store.elements)
}
