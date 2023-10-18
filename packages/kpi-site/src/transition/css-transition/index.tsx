import { useEvent } from '@kpi/shared'
import useFormatClassNames from './hooks/use_format_class_names'
import useFormatTimeouts from './hooks/use_format_timeouts'
import useTransitionEffect from './hooks/use_transition_effect'
import useTransitionStore from './hooks/use_transition_store'
import { addClassName, delClassName } from './utils/classnames'

import type { CSSTransitionProps } from './props'

// 还是要添加 mountOnEnter 与 unmountOnExit
export default function CSSTransition<E extends HTMLElement = HTMLElement>(
  props: CSSTransitionProps<E>
) {
  const { children, appear, when, name, duration, classNames } = props

  const store = useTransitionStore<E>()

  const classes = useFormatClassNames(name, classNames)

  const timeouts = useFormatTimeouts(duration)

  useTransitionEffect(store, classes, timeouts, props)

  const refCallback = useEvent((el: E | null) => {
    if (!el || store.instance === el) return

    store.setInstance(el)

    // 元素挂载前的操作
    const step = when ? 'enter' : 'exit'
    const appearInitial = appear && when && store.isInitial
    const className = appearInitial ? classes.appear.from : classes[step].to

    addClassName(el, className)

    store.setInitHook(() => delClassName(el, className))
  })

  return children(refCallback)
}

function test() {
  const start = performance.now()

  for (let i = 0; i < 3000; i++) {
    const a = { a: 1, b: 2, c: 3, d: 4 }
    const b = {}

    Object.entries(a).forEach(([k, v]) => {
      if (b[k] === undefined) b[k] = v
    })
  }

  return performance.now() - start
}
