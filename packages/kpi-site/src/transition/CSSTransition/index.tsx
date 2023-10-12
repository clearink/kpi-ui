import useFormatClassNames from './hooks/useFormatClassNames'
import useTransitionEffect from './hooks/useTransitionEffect'
import useTransitionStore from './hooks/useTransitionStore'

import type { CSSTransitionProps } from './props'

export default function CSSTransition<E extends HTMLElement = HTMLElement>(
  props: CSSTransitionProps<E>
) {
  const classNames = useFormatClassNames(props.name, props.classNames)

  const store = useTransitionStore<E>()

  useTransitionEffect(store, classNames, props)

  return props.children(store.setInstance)
}
