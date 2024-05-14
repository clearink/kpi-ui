// trigger events

import { DOMAttributes } from 'react'

// 除了 hover 时， popup 都是使用 click 结束 close 的
// hover
export function getHoverEvents(
  onOpen: () => void,
  onClose: () => void
): [DOMAttributes<HTMLElement>, DOMAttributes<HTMLElement>] {
  const onMouseEnter = onOpen

  const onMouseLeave = onClose

  return [
    { onMouseEnter, onMouseLeave },
    { onMouseEnter, onMouseLeave },
  ]
}

// focus
export function getFocusEvents(
  onOpen: () => void,
  onClose: () => void
): [DOMAttributes<HTMLElement>, DOMAttributes<HTMLElement>] {
  return [{ onFocus: onOpen, onBlur: onClose }, {}]
}

// click
export function getClickEvents(
  onOpen: () => void,
  onClose: () => void
): [DOMAttributes<HTMLElement>, DOMAttributes<HTMLElement>] {
  return [
    {
      onClick: onOpen,
    },
    {},
  ]
}

// contextmenu
export function getContextMenuEvents(
  onOpen: () => void,
  onClose: () => void
): [DOMAttributes<HTMLElement>, DOMAttributes<HTMLElement>] {
  return [{}, {}]
}
