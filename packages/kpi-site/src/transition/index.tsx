import useFormatClassNames from './hooks/useFormatClassNames'
// import useTransitionCancel from './hooks/useTransitionCancel'
import useTransitionEffect from './hooks/useTransitionEffect'
import useTransitionEnd from './hooks/useTransitionEnd'
import useTransitionStore from './hooks/useTransitionStore'

import type { TransitionProps } from './props'

export default function Transition<E extends HTMLElement = HTMLElement>(props: TransitionProps<E>) {
  const classNames = useFormatClassNames(props.name, props.classNames)

  const store = useTransitionStore(props)

  useTransitionEffect(store, classNames, props)

  useTransitionEnd(store, classNames, props)

  // useTransitionCancel(store, classNames, props)

  return props.children(store.current)
}
