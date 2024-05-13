import { hasItem, toArray } from '@kpi-ui/utils'
// types
import { DOMAttributes, useCallback } from 'react'
import type { TooltipProps } from '../props'

// TODO: 完善这里

// 触发条件
export default function useTriggerEvent(
  props: TooltipProps,
  setOpen: (state: boolean, delay?: number) => void
) {
  const { trigger, openDelay, closeDelay } = props

  const actions = toArray(trigger)

  const triggerHandlers: DOMAttributes<HTMLDivElement> = {}

  const popupHandlers: DOMAttributes<HTMLElement> = {}

  const onOpen = useCallback(() => {
    setOpen(true, openDelay)
  }, [openDelay, setOpen])

  const onClose = useCallback(() => {
    setOpen(false, closeDelay)
  }, [closeDelay, setOpen])

  if (hasItem(actions, 'hover')) {
    // if (isMobile) {
    //   handlers.onPointerEnter = onOpen
    //   handlers.onPointerLeave = onClose
    // } else {
    triggerHandlers.onMouseEnter = onOpen
    // 如果在 popup内则不执行onClose
    triggerHandlers.onMouseLeave = (e) => {
      console.log(e.nativeEvent, 'leave')
      onClose()
    }

    popupHandlers.onMouseEnter = (e) => {
      console.log('popup enter')
      onOpen()
    }

    popupHandlers.onMouseLeave = (e) => {
      console.log('popup leave')
      onClose()
    }
    // }
  }

  if (hasItem(actions, 'click')) {
    // if (isMobile) {
    //   handlers.onTouchStart = onOpen
    // } else {
    triggerHandlers.onClick = onClose
    // }
  }

  if (hasItem(actions, 'focus')) {
    triggerHandlers.onFocus = onOpen
    triggerHandlers.onBlur = onClose
  }

  return [triggerHandlers, popupHandlers] as const
}
