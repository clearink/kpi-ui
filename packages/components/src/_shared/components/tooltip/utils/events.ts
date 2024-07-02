import { type DOMAttributes, type MouseEventHandler } from 'react'

import type useTooltipOpen from '../hooks/use_tooltip_open'

// 除了 hover 时， popup 都是使用 click 结束 close 的
// hover
export function getHoverEvents(
  setOpen: ReturnType<typeof useTooltipOpen>[1],
): [DOMAttributes<HTMLElement>, DOMAttributes<HTMLElement>] {
  const onMouseEnter = () => {
    setOpen(() => true)
  }

  const onMouseLeave = () => {
    setOpen(() => false)
  }

  return [
    { onMouseEnter, onMouseLeave },
    { onMouseEnter, onMouseLeave },
  ]
}

// click
export function getClickEvents(
  setOpen: ReturnType<typeof useTooltipOpen>[1],
): [DOMAttributes<HTMLElement>, DOMAttributes<HTMLElement>] {
  const onClick = () => {
    setOpen(state => !state)
  }

  return [{ onClick }, {}]
}

// focus
export function getFocusEvents(
  setOpen: ReturnType<typeof useTooltipOpen>[1],
): [DOMAttributes<HTMLElement>, DOMAttributes<HTMLElement>] {
  const onFocus = () => {
    setOpen(() => true)
  }

  const onBlur = () => {
    setOpen(() => false)
  }

  return [{ onBlur, onFocus }, {}]
}

// contextmenu
export function getContextMenuEvents(
  setOpen: ReturnType<typeof useTooltipOpen>[1],
): [DOMAttributes<HTMLElement>, DOMAttributes<HTMLElement>] {
  const onContextMenu: MouseEventHandler = (e) => {
    e.preventDefault()

    setOpen(state => !state)
  }

  return [{ onContextMenu }, {}]
}
