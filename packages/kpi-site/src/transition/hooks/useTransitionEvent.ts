import { pushItem, useEvent } from '@kpi/shared'
import { RefObject, useLayoutEffect } from 'react'
import useStableCounter from './useStableCounter'
import type { TransitionProps } from '..'
import formatClassNames from '../utils/format'
import cleanupTransitionClass from '../utils/cleanup'

export default function useTransitionEvent<El extends HTMLElement>(
  ref: RefObject<El>,
  counter: ReturnType<typeof useStableCounter>,
  classNames: ReturnType<typeof formatClassNames>,
  props: TransitionProps<El>
) {
  const { when, unmountOnExit, onEntered, onEnterCancel, onExited, onExitCancel } = props

  // TODO: 需要判断当前是什么模式
  // TODO: 需要找出当前模式下耗时最长的属性值

  const handleFinish = useEvent((e: TransitionEvent | AnimationEvent) => {
    console.log('handleFinish', e)
    // animation
    if (e instanceof AnimationEvent) {
      const collection = getComputedStyle(ref.current!)
      const { transitionDelay, transitionDuration, transitionProperty } = collection

      if (when) onEntered && onEntered(ref.current!, counter.get() <= 1)
      else {
        onExited && onExited(ref.current!)
        if (unmountOnExit) {
          // 渲染 null
        }
      }
    } else {
      // transition
      // const collection = getComputedStyle(ref.current!)
      // const { transitionDelay, transitionDuration, transitionProperty } = collection
      // const delayList = transitionDelay.split(/[,\s]+/g).map(parseFloat)
      // const durationList = transitionDuration.split(/[,\s]+/g).map(parseFloat)
      // const propertyList = transitionProperty.split(/[,\s]+/g)
      // const a = propertyList.reduce((res, prop, i) => {
      //   return pushItem(res, { prop, duration: durationList[i] + delayList[i] })
      // }, [] as { prop: string; duration: number }[])

      // let max = a[0]
      // a.forEach((item) => {
      //   if (max.duration < item.duration) max = item
      // })

      // if (max.prop !== e.propertyName) return

      // eslint-disable-next-line no-lonely-if
      if (when) onEntered && onEntered(ref.current!, counter.get() <= 1)
      else {
        onExited && onExited(ref.current!)
        if (unmountOnExit) {
          // 渲染 null
        }
      }
    }

    // cleanupClassNames(ref.current!, classNames)
  })

  const handleCancel = useEvent((e: TransitionEvent | AnimationEvent) => {
    const property = e instanceof AnimationEvent ? e.animationName : e.propertyName

    if (when) {
      cleanupTransitionClass(ref.current!, classNames.exit.from)
      cleanupTransitionClass(ref.current!, classNames.exit.active)
      cleanupTransitionClass(ref.current!, classNames.exit.to)
    } else {
      // finish enter
      const step = counter.get() <= 1 ? 'appear' : 'enter'
      cleanupTransitionClass(ref.current!, classNames[step].from)
      cleanupTransitionClass(ref.current!, classNames[step].active)
    }

    if (when) onExitCancel && onExitCancel(ref.current!)
    else onEnterCancel && onEnterCancel(ref.current!, counter.get() <= 1)
  })

  useLayoutEffect(() => {
    const dom = ref.current

    if (!dom) return

    dom.addEventListener('transitionend', handleFinish)
    dom.addEventListener('animationend', handleFinish)

    dom.addEventListener('transitioncancel', handleCancel)
    return () => {
      dom.removeEventListener('transitionend', handleFinish)
      dom.removeEventListener('animationend', handleFinish)

      dom.removeEventListener('transitioncancel', handleCancel)
    }
  }, [ref, handleFinish, handleCancel])
}
