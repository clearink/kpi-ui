// utils
import { useResizeObserver, useThrottleCallback } from '@kpi-ui/hooks'
import { ownerWindow } from '@kpi-ui/utils'
import { useEffect } from 'react'
import getScrollElements from '../utils/scrollable'
// types
import type { TooltipStore } from './use_tooltip_store'

// 监听 trigger 是否改变
export default function useTriggerObserver(store: TooltipStore, open: boolean) {
  const onChange = useThrottleCallback(100, (el: Element) => {})

  useResizeObserver(store.$trigger, onChange)

  // scroll 事件如何绑定比较好？
  useEffect(() => {
    const tooltip = store.$tooltip.current

    const trigger = store.$trigger.current

    if (!open || !tooltip || !trigger) return

    const elements = [ownerWindow(), ...getScrollElements(tooltip), ...getScrollElements(trigger)]

    elements.forEach((el) => {
      el.addEventListener('scroll', onChange)
    })

    return () => {
      elements.forEach((el) => {
        el.removeEventListener('scroll', onChange)
      })
    }
  }, [open, store, onChange])
}
