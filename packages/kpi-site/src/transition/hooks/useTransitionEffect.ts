import { useCallback, useLayoutEffect } from 'react'
import { useEvent } from '@kpi/shared'
import type { RefObject } from 'react'
import useStableCounter from './useTransitionStore'
import formatClassNames from '../utils/format'
import reflow from '../utils/reflow'
import { addTransitionClass, delTransitionClass } from '../utils/classnames'

import type { TransitionProps } from '..'

const nextTick = (callback: () => void) => {
  const id = requestAnimationFrame(callback)
  return () => cancelAnimationFrame(id)
}

const nextFrame = (callback: () => void) => {
  return nextTick(() => {
    nextTick(callback)
  })
}

export default function useTransitionEffect<El extends HTMLElement = HTMLElement>(
  ref: RefObject<El>,
  counter: ReturnType<typeof useStableCounter>,
  classNames: ReturnType<typeof formatClassNames>,
  props: TransitionProps<El>
) {
  const { appear, when, onEnter, onEntering, onExit, onExiting } = props

  // TODO: 结束动画
  const handleFinish = useCallback(() => {}, [])

  // name 改变不会重新应用动画, 决定是否需要进行动画的只有 when 属性
  const doTransition = useEvent((step: 'appear' | 'enter' | 'exit') => {
    const el = ref.current

    if (!el) return
    ;['appear', 'enter', 'exit'].forEach((s) => {
      ;['from', 'active', 'to'].forEach((status) => {
        delTransitionClass(el, classNames[s][status])
      })
    })

    // 此处需要处理 进入与其下一帧 的回调函数
    if (step === 'exit') onExit && onExit(el)
    else onEnter && onEnter(el, step === 'appear')

    addTransitionClass(el, classNames[step].from)
    addTransitionClass(el, classNames[step].active)

    // 回流，使添加的 class 立即生效
    reflow(el)

    if (step === 'exit') onExiting && onExiting(el, handleFinish)
    else onEntering && onEntering(el, handleFinish, step === 'appear')

    addTransitionClass(el, classNames[step].to)

    delTransitionClass(el, classNames[step].from)
  })

  useLayoutEffect(() => {
    counter.add()
    if (counter.get() > 1) doTransition(when ? 'enter' : 'exit')
    if (appear) doTransition('appear')
  }, [appear, counter, doTransition, when])
}
