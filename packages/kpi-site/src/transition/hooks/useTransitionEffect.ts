import { useEvent, useIsomorphicEffect } from '@kpi/shared'
import type { RefObject } from 'react'
import { addClassName, delClassName } from '../utils/classnames'
import nextFrame from '../utils/next-frame'
import reflow from '../utils/reflow'
import useFormatClassNames from './useFormatClassNames'
import useTransitionStore from './useTransitionStore'

import type { TransitionProps } from '../props'

export default function useTransitionEffect<E extends HTMLElement>(
  ref: RefObject<E>,
  store: ReturnType<typeof useTransitionStore>,
  classNames: ReturnType<typeof useFormatClassNames>,
  props: TransitionProps<E>
) {
  const { appear, when, onEnter, onEntering, onExit, onExiting } = props

  // name 改变不会重新应用动画, 决定是否需要进行动画的只有 when 属性
  const handleTransition = useEvent((step: 'appear' | 'enter' | 'exit') => {
    const el = ref.current

    if (!el) return

    // 使用变量记录是否已经完成了动画， 如果没有那么就调用 cancel

    const appearing = step === 'appear'

    if (step === 'exit') onExit && onExit(el)
    else onEnter && onEnter(el, appearing)

    addClassName(el, classNames[step].from)

    // TODO: 这里是否需要？
    if (step === 'exit') reflow(el)

    addClassName(el, classNames[step].active)

    // 下一帧调用
    const cancelFrame = nextFrame(() => {
      if (step === 'exit') onExiting && onExiting(el)
      else onEntering && onEntering(el, appearing)

      delClassName(el, classNames[step].from)

      addClassName(el, classNames[step].to)
    })

    return () => {
      cancelFrame()
      console.log('检查是否 cancel transition')
      // if (!hasExplicitCallback(hook)) {
      //   whenTransitionEnds(el, type, enterDuration, resolve)
      // }
    }
  })

  useIsomorphicEffect(() => {
    store.add()

    if (store.get() > 1) return handleTransition(when ? 'enter' : 'exit')

    if (appear) return handleTransition('appear')
  }, [appear, store, handleTransition, when])
}
