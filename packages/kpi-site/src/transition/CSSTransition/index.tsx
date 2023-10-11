import useFormatClassNames from './hooks/useFormatClassNames'
import useTransitionEffect from './hooks/useTransitionEffect'
import useTransitionStore from './hooks/useTransitionStore'

import type { TransitionProps } from './props'

export default function CSSTransition<E extends HTMLElement = HTMLElement>(
  props: TransitionProps<E>
) {
  const classNames = useFormatClassNames(props.name, props.classNames)

  const store = useTransitionStore<E>()

  useTransitionEffect(store, classNames, props)

  if (store.shouldUnmount && !props.when) return null

  return props.children(store.setInstance)
}
