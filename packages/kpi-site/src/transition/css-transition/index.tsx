import { useEvent } from '@kpi/shared'
import useFormatClassNames from './hooks/use_format_class_names'
import useTransitionEffect from './hooks/use_transition_effect'
import useTransitionStore from './hooks/use_transition_store'
import { addTransitionClass, delTransitionClass } from './utils/classnames'

import type { CSSTransitionProps } from './props'

// 还是要添加 mountOnEnter 与 unmountOnExit
export default function CSSTransition<E extends HTMLElement = HTMLElement>(
  props: CSSTransitionProps<E>
) {
  const { children, appear, when, name, classNames: $classNames } = props

  const store = useTransitionStore<E>()

  const classNames = useFormatClassNames(name, $classNames)

  useTransitionEffect(store, classNames, props)

  const refCallback = useEvent((el: E | null) => {
    if (!el || store.instance === el) return

    store.setInstance(el)

    // 元素挂载前的操作
    const step = when ? 'enter' : 'exit'
    const appearInitial = appear && when && store.isInitial
    const className = appearInitial ? classNames.appear.from : classNames[step].to

    addTransitionClass(el, className)

    store.setInitHook(() => delTransitionClass(el, className))
  })

  return children(refCallback)
}
