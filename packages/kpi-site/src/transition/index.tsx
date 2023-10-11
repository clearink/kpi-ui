import useFormatClassNames from './hooks/useFormatClassNames'
import useTransitionEffect from './hooks/useTransitionEffect'
import useTransitionStore from './hooks/useTransitionStore'

import type { TransitionProps } from './props'

export default function Transition<E extends HTMLElement = HTMLElement>(props: TransitionProps<E>) {
  const classNames = useFormatClassNames(props.name, props.classNames)

  const store = useTransitionStore<E>()

  useTransitionEffect(store, classNames, props)

  return props.children(store.setInstance)
}
