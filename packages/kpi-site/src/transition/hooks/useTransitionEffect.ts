import { useCallback, useLayoutEffect } from 'react'
import { useEvent } from '@kpi/shared'
import type { RefObject } from 'react'
import useStableCounter from './useStableCounter'
import formatClassNames from '../utils/format'
import reflow from '../utils/reflow'
import cleanupClassNames from '../utils/cleanup'

import type { TransitionProps } from '..'

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
    const dom = ref.current

    if (!dom) return
    ;['appear', 'enter', 'exit'].forEach((s) => {
      ;['from', 'active', 'to'].forEach((status) => {
        cleanupClassNames(dom, classNames[s][status])
      })
    })

    // 此处需要处理 进入与其下一帧 的回调函数
    if (step === 'exit') onExit && onExit(dom)
    else onEnter && onEnter(dom, step === 'appear')

    dom.classList.add(classNames[step].from)

    dom.classList.add(classNames[step].active)

    // 回流，使添加的 class 立即生效
    reflow(dom)

    if (step === 'exit') onExiting && onExiting(dom, handleFinish)
    else onEntering && onEntering(dom, handleFinish, step === 'appear')

    dom.classList.add(classNames[step].to)

    dom.classList.remove(classNames[step].from)
  })

  useLayoutEffect(() => {
    counter.add()
    if (counter.get() > 1) doTransition(when ? 'enter' : 'exit')
    else if (appear) doTransition('appear')
  }, [appear, counter, doTransition, when])
}
