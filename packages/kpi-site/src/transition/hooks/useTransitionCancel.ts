import { pushItem, useEvent } from '@kpi/shared'
import { RefObject, useLayoutEffect } from 'react'
import { delClassName } from '../utils/classnames'
import useFormatClassNames from './useFormatClassNames'
import useTransitionStore from './useTransitionStore'

import type { TransitionProps } from '../props'

export default function useTransitionCancel<E extends HTMLElement>(
  ref: RefObject<E>,
  store: ReturnType<typeof useTransitionStore>,
  classNames: ReturnType<typeof useFormatClassNames>,
  props: TransitionProps<E>
) {
  const { when, unmountOnExit, addEndListener, onEntered, onExited } = props

  // TODO: 需要判断当前是什么模式
  // TODO: 需要找出当前模式下耗时最长的属性值

  const handleFinish = useEvent((e: TransitionEvent | AnimationEvent) => {
    // animation
    if (e instanceof AnimationEvent) {
      const collection = getComputedStyle(ref.current!)
      const { transitionDelay, transitionDuration, transitionProperty } = collection

      if (when) onEntered && onEntered(ref.current!, store.get() <= 1)
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
        delClassName(ref.current!, classNames.enter.active)
        delClassName(ref.current!, classNames.enter.to)

        onEntered && onEntered(ref.current!, store.get() <= 1)
      } else {
        delClassName(ref.current!, classNames.exit.active)
        delClassName(ref.current!, classNames.exit.to)

        onExited && onExited(ref.current!)
        // if (unmountOnExit) {
        //   // 渲染 null
        // }
      }
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
