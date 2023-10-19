/* eslint-disable no-param-reassign */
import { cloneElement, useEffect } from 'react'
import useTransitionStore from './use_transition_store'
import isSameElement from '../utils/same'

import type { SwitchTransitionProps } from '../props'
import batch from '../../css-transition/utils/batch'

export default function useCalculateChange(
  store: ReturnType<typeof useTransitionStore>,
  props: SwitchTransitionProps
) {
  const { children, mode } = props

  // 获取最新的子元素
  store.updateChildren(children)

  useEffect(() => store.setInitial(false), [store])

  // 相同元素不处理
  if (isSameElement(store.current, children)) return

  if (mode === 'out-in') {
    if (store.running) return

    // store.running = true
    store.startOutIn()

    // const resolve = () => {
    //   const p: any = { when: true, unmountOnExit: true }

    //   if (!store.isInitial) p.appear = true

    //   store.current = cloneElement(store.children!, {
    //     ...p,
    //     onEntering: batch(store.children!.props.onEntering, store.stop),
    //   })

    //   store.forceUpdate()
    // }
  } else if (mode === 'in-out') store.startInOut()
  else store.startBoth()
}
