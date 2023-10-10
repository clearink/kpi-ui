import { useEvent, useIsomorphicEffect } from '@kpi/shared'
import { addClassName, delClassName } from '../utils/classnames'
import nextFrame from '../utils/next-frame'
import reflow from '../utils/reflow'
import useFormatClassNames from './useFormatClassNames'
import useTransitionStore from './useTransitionStore'
import useTransitionCancel from './useTransitionCancel'

import type { TransitionProps, TransitionStep } from '../props'

export default function useTransitionEffect<E extends HTMLElement>(
  store: ReturnType<typeof useTransitionStore<E>>,
  classNames: ReturnType<typeof useFormatClassNames>,
  props: TransitionProps<E>
) {
  const { appear, when, onEnter, onEntering, onExit, onExiting } = props

  const handleCancel = useTransitionCancel(store, classNames, props)

  // name 改变不会重新应用动画, 决定是否需要进行动画的只有 when 属性
  const handleTransition = useEvent((step: TransitionStep) => {
    const el = store.ref.current

    if (!el) return

    const appearing = step === 'appear'

    if (step === 'exit') onExit && onExit(el)
    else onEnter && onEnter(el, appearing)

    addClassName(el, classNames[step].from)

    if (step === 'exit') reflow(el)

    addClassName(el, classNames[step].active)

    const cancelFrame = nextFrame(() => {
      if (step === 'exit') onExiting && onExiting(el)
      else onEntering && onEntering(el, appearing)

      delClassName(el, classNames[step].from)

      addClassName(el, classNames[step].to)
    })

    return () => {
      cancelFrame()
      handleCancel(el, step)
    }
  })

  useIsomorphicEffect(() => {
    store.update()

    if (store.count > 1) return handleTransition(when ? 'enter' : 'exit')

    if (appear) return handleTransition('appear')
  }, [appear, store, handleTransition, when])
}
