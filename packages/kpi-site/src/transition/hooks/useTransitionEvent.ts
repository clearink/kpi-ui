import { pushItem, useEvent } from '@kpi/shared'
import { RefObject, useLayoutEffect } from 'react'
import useStableCounter from './useTransitionStore'
import type { TransitionProps } from '..'
import formatClassNames from '../utils/format'
import { delTransitionClass } from '../utils/classnames'

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
      const collection = getComputedStyle(ref.current!)

      const { transitionDelay, transitionDuration, transitionProperty } = collection
      const delayList = transitionDelay.split(', ').map(parseFloat)
      const durationList = transitionDuration.split(', ').map(parseFloat)
      const propertyList = transitionProperty.split(', ')
      const a = propertyList.reduce((res, prop, i) => {
        return pushItem(res, { prop, duration: durationList[i] + delayList[i] })
      }, [] as { prop: string; duration: number }[])

      let max = a[0]
      a.forEach((item) => {
        if (max.duration < item.duration) max = item
      })

      console.log(a, max, e.propertyName)

      if (max.prop !== e.propertyName) return

      if (when) {
        delTransitionClass(ref.current!, classNames.enter.active)
        delTransitionClass(ref.current!, classNames.enter.to)

        onEntered && onEntered(ref.current!, counter.get() <= 1)
      } else {
        delTransitionClass(ref.current!, classNames.exit.active)
        delTransitionClass(ref.current!, classNames.exit.to)

        onExited && onExited(ref.current!)
        // if (unmountOnExit) {
        //   // 渲染 null
        // }
      }
    }
  })

  // cancel 不是监听 DOM 的, 而是手动调用的
  const handleCancel = useEvent((e: TransitionEvent | AnimationEvent) => {
    const property = e instanceof AnimationEvent ? e.animationName : e.propertyName

    if (when) {
      delTransitionClass(ref.current!, classNames.exit.from)
      delTransitionClass(ref.current!, classNames.exit.active)
      delTransitionClass(ref.current!, classNames.exit.to)

      onExitCancel && onExitCancel(ref.current!)
    } else {
      // finish enter
      const step = counter.get() <= 1 ? 'appear' : 'enter'
      delTransitionClass(ref.current!, classNames[step].from)
      delTransitionClass(ref.current!, classNames[step].active)

      onEnterCancel && onEnterCancel(ref.current!, counter.get() <= 1)
    }
  })

  useLayoutEffect(() => {
    const dom = ref.current

    if (!dom) return

    dom.addEventListener('transitionend', handleFinish)
    dom.addEventListener('animationend', handleFinish)

    return () => {
      dom.removeEventListener('transitionend', handleFinish)
      dom.removeEventListener('animationend', handleFinish)
    }
  }, [ref, handleFinish])
}
