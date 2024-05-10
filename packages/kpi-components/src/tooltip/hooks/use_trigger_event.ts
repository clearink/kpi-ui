import { hasItem, toArray } from '@kpi-ui/utils'
// types
import type { DOMAttributes, SetStateAction } from 'react'
import type { TooltipProps } from '../props'

// TODO: 完善这里

// 触发条件
export default function useTriggerEvent(
  props: TooltipProps,
  setOpen: (state: SetStateAction<boolean>, delay?: number) => void
) {
  const { trigger, openDelay, closeDelay } = props

  const actions = toArray(trigger)

  const handlers: DOMAttributes<HTMLDivElement> = {}

  // prettier-ignore
  const onOpen = () => { setOpen(true, openDelay) }

  // prettier-ignore
  const onClose = () => { setOpen(false, closeDelay) }

  if (hasItem(actions, 'hover')) {
    // if (isMobile) {
    //   handlers.onPointerEnter = onOpen
    //   handlers.onPointerLeave = onClose
    // } else {
    handlers.onMouseEnter = onOpen
    // 如果在 popup内则不执行onClose
    handlers.onMouseLeave = onClose
    // }
  }

  if (hasItem(actions, 'click')) {
    // if (isMobile) {
    //   handlers.onTouchStart = onOpen
    // } else {
    handlers.onClick = onClose
    // }
  }

  if (hasItem(actions, 'focus')) {
    handlers.onFocus = onOpen
    handlers.onBlur = onClose
  }

  return handlers
}
