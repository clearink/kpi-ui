import { type DOMAttributes, type MouseEventHandler } from 'react'
import type useTooltipOpen from '../hooks/use_tooltip_open'
// types
import type { TriggerEventOption } from '../props'

// 除了 hover 时， popup 都是使用 click 结束 close 的
// hover
export function getHoverEvents(
  option: TriggerEventOption,
  [state, setOpen]: ReturnType<typeof useTooltipOpen>
): [DOMAttributes<HTMLElement>, DOMAttributes<HTMLElement>] {
  const { openDelay, closeDelay } = option

  const onMouseEnter = () => {
    setOpen(true, openDelay)
  }

  const onMouseLeave = () => {
    setOpen(false, closeDelay)
  }

  return [
    { onMouseEnter, onMouseLeave },
    { onMouseEnter, onMouseLeave },
  ]
}

// click
export function getClickEvents(
  option: TriggerEventOption,
  [state, setOpen]: ReturnType<typeof useTooltipOpen>
): [DOMAttributes<HTMLElement>, DOMAttributes<HTMLElement>] {
  const { openDelay } = option

  const onClick = () => {
    setOpen(!state, openDelay)
  }

  return [{ onClick }, {}]
}

// focus
export function getFocusEvents(
  option: TriggerEventOption,
  [state, setOpen]: ReturnType<typeof useTooltipOpen>
): [DOMAttributes<HTMLElement>, DOMAttributes<HTMLElement>] {
  const { openDelay, closeDelay } = option

  const onFocus = () => {
    setOpen(true, openDelay)
  }

  const onBlur = () => {
    setOpen(false, closeDelay)
  }

  return [{ onFocus, onBlur }, {}]
}

// contextmenu
export function getContextMenuEvents(
  option: TriggerEventOption,
  [state, setOpen]: ReturnType<typeof useTooltipOpen>
): [DOMAttributes<HTMLElement>, DOMAttributes<HTMLElement>] {
  const { openDelay } = option

  const onContextMenu: MouseEventHandler = (e) => {
    e.preventDefault()

    setOpen(!state, openDelay)
  }

  return [{ onContextMenu }, {}]
}
