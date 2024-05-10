import { fallback, isArray, isObject, isUndefined, ownerRoot } from '@kpi-ui/utils'
// types
import type {
  ArrowCoords,
  FlipPopupCoordsOptions,
  GetArrowCoordsOptions,
  GetScreenCoordsOptions,
  HorizontalCrossAxis,
  HorizontalMainAxis,
  KeepArrowCenterOptions,
  ScreenCoords,
  ShiftPopupCoordsOptions,
  TooltipProps,
  VerticalCrossAxis,
  VerticalMainAxis,
} from '../props'

const _size = 8
const _sqrt = 5.66
const _px = 8
const _py = 4
const _offset = 4
const _effect = 4

/* ****************************** screen coords ****************************** */

export function getTopOrBottomScreenCoords(main: HorizontalMainAxis, cross: HorizontalCrossAxis) {
  return (options: GetScreenCoordsOptions): ScreenCoords => {
    const { props, triggerCoords: trigger, popupCoords: popup } = options

    const dy = (props.arrow ? _effect : 0) + _offset

    const top = main === 'top' ? trigger.top - popup._height - dy : trigger.bottom + dy

    const dx = trigger.width - popup._width

    const left = trigger.left + (cross === 'left' ? 0 : cross === 'right' ? dx : dx / 2)

    const root = ownerRoot(trigger.el)

    return {
      top,
      left,
      main,
      cross,
      _width: popup._width,
      _height: popup._height,
      _mx: root.clientWidth,
      _my: root.clientHeight,
      _delta: 0,
    }
  }
}

export function getLeftOrRightScreenCoords(main: VerticalMainAxis, cross: VerticalCrossAxis) {
  return (options: GetScreenCoordsOptions): ScreenCoords => {
    const { props, triggerCoords: trigger, popupCoords: popup } = options

    const dx = (props.arrow ? _effect : 0) + _offset

    const left = main === 'left' ? trigger.left - popup._width - dx : trigger.right + dx

    const dy = trigger.height - popup._height

    const top = trigger.top + (cross === 'top' ? 0 : cross === 'bottom' ? dy : dy / 2)

    const root = ownerRoot(trigger.el)

    return {
      top,
      left,
      main,
      cross,
      _width: popup._width,
      _height: popup._height,
      _mx: root.clientWidth,
      _my: root.clientHeight,
      _delta: 0,
    }
  }
}

/* ****************************** arrow center ****************************** */
export function keepTopOrBottomArrowCenter() {
  const getLeftCoords = (options: KeepArrowCenterOptions) => {
    // prettier-ignore
    const { adjustedCoords: { left, cross }, triggerCoords: trigger } = options

    const dx = trigger.width / 2 - _px - _size

    const factor = cross === 'left' ? 1 : cross === 'right' ? -1 : 0

    return [left + factor * dx, dx] as const
  }

  return (options: KeepArrowCenterOptions): ScreenCoords => {
    // prettier-ignore
    const { props: { arrow }, adjustedCoords: popup } = options

    if (!(isObject(arrow) && arrow.pointAtCenter)) return popup

    const [left, _delta] = getLeftCoords(options)

    return { ...popup, left, _delta }
  }
}

export function keepLeftOrRightArrowCenter() {
  const getTopCoords = (options: KeepArrowCenterOptions) => {
    // prettier-ignore
    const { adjustedCoords: { top, cross }, triggerCoords: trigger } = options

    const dy = trigger.height / 2 - _py - _size

    const factor = cross === 'top' ? 1 : cross === 'bottom' ? -1 : 0

    return [top + factor * dy, dy] as const
  }

  return (options: KeepArrowCenterOptions): ScreenCoords => {
    // prettier-ignore
    const { props: { arrow }, adjustedCoords: popup } = options

    if (!(isObject(arrow) && arrow.pointAtCenter)) return popup

    const [top, _delta] = getTopCoords(options)

    return { ...popup, top, _delta }
  }
}

/* ****************************** popup offset ****************************** */

export function offsetPopupCoords(adjustedCoords: ScreenCoords, offset: TooltipProps['offset']) {
  const { top, left, main } = adjustedCoords

  const [horizontal, vertical] = isArray(offset) ? [offset[0], offset[1]] : [offset, 0]

  const factor = main === 'top' || main === 'left' ? -1 : 1

  return {
    ...adjustedCoords,
    top: top + (vertical || 0) * factor,
    left: left + (horizontal || 0) * factor,
  }
}

/* ****************************** shift coords ****************************** */

// 调整上，下的水平方向
export function shiftTopOrBottomPopupCoords() {
  const getLeftCoords = (options: ShiftPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    const min = (_px + _size) * 2 + popup._delta

    const max = popup._mx - popup._width

    if (popup.left <= 0) return Math.min(trigger.right - min, 0)

    if (popup.left >= max) return Math.max(trigger.left - popup._width + min, max)
  }

  return (options: ShiftPopupCoordsOptions): ScreenCoords => {
    // prettier-ignore
    const { props: { shift }, adjustedCoords: popup } = options

    if (!shift || (isObject(shift) && shift.horizontal === false)) return popup

    const left = getLeftCoords(options)

    return { ...popup, left: fallback(left, popup.left)! }
  }
}

// 调整左，右的竖直方向
export function shiftLeftOrRightPopupCoords() {
  const getTopCoords = (options: ShiftPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    const min = (_py + _size) * 2 + popup._delta

    const max = popup._my - popup._height

    if (popup.top <= 0) return Math.min(trigger.bottom - min, 0)

    if (popup.top >= max) return Math.max(trigger.top - popup._height + min, max)
  }

  return (options: ShiftPopupCoordsOptions): ScreenCoords => {
    // prettier-ignore
    const { props: { shift }, adjustedCoords: popup } = options

    if (!shift || (isObject(shift) && shift.vertical === false)) return popup

    const top = getTopCoords(options)

    return { ...popup, top: fallback(top, popup.top)! }
  }
}

/* ****************************** flip coords ****************************** */

// 翻转上，下主轴
export function flipTopOrBottomPopupCoords() {
  const getTopCoords = (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    if (popup.main === 'top' && popup.top > 0) return

    const bottom = popup.top + popup._height

    if (popup.main === 'bottom' && bottom < popup._my) return

    // 保证有足够的空间 ？

    return trigger.bottom + trigger.top - bottom
  }

  return (options: FlipPopupCoordsOptions) => {
    // prettier-ignore
    const { props : { flip }, adjustedCoords: popup } = options

    if (!flip || (isObject(flip) && !flip.vertical)) return popup

    const top = getTopCoords(options)

    const flipped = !isUndefined(top)

    const _main = popup.main === 'top' ? 'bottom' : 'top'

    return {
      ...popup,
      top: flipped ? top : popup.top,
      main: flipped ? _main : popup.main,
    }
  }
}

// 翻转左，右主轴
export function flipLeftOrRightPopupCoords() {
  const getLeftCoords = (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    if (popup.main === 'left' && popup.left > 0) return

    const popupRight = popup.left + popup._width

    if (popup.main === 'right' && popupRight < popup._mx) return

    return trigger.right + trigger.left - popupRight
  }

  return (options: FlipPopupCoordsOptions) => {
    // prettier-ignore
    const { props : { flip }, adjustedCoords: popup } = options

    if (!flip || (isObject(flip) && !flip.horizontal)) return popup

    const left = getLeftCoords(options)

    const flipped = !isUndefined(left)

    const _main = popup.main === 'left' ? 'right' : 'left'

    return {
      ...popup,
      left: flipped ? left : popup.left,
      main: flipped ? _main : popup.main,
    }
  }
}

/* ****************************** arrow coords ****************************** */

export function getTopOrBottomArrowCoords() {
  return (options: GetArrowCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    const rotate = popup.main === 'top' ? 0 : 180

    const top = (popup.main === 'top' ? popup._height : 0) - _size

    const dx = _px + _size * 2

    const min = Math.max(trigger.left, popup.left - popup._delta)

    const max = Math.min(trigger.right, popup.left + popup._width + popup._delta)

    let left = -popup.left

    if (popup.cross === 'left') left += min + _px + popup._delta
    else if (popup.cross === 'right') left += max - dx - popup._delta
    else left += (max + min) / 2 - _size

    return { top, left, rotate }
  }
}

export function getLeftOrRightArrowCoords() {
  return (options: GetArrowCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    const rotate = popup.main === 'left' ? 270 : 90

    const left = (popup.main === 'left' ? popup._width : 0) - _size

    const dy = _py + _size * 2

    const min = Math.max(trigger.top, popup.top - popup._delta)

    const max = Math.min(trigger.bottom, popup.top + popup._height + popup._delta)

    let top = -popup.top

    if (popup.cross === 'top') top += min + _py + popup._delta
    else if (popup.cross === 'bottom') top += max - dy - popup._delta
    else top += (max + min) / 2 - _size

    return { top, left, rotate }
  }
}

/* ****************************** origin coords ****************************** */

export function getTopOrBottomOriginCoords() {
  return (arrow: ArrowCoords, adjusted: ScreenCoords) => {
    const factor = adjusted.main === 'top' ? 1 : -1

    return {
      top: arrow.top + _size + factor * _sqrt,
      left: arrow.left + _size,
    }
  }
}

export function getLeftOrRightOriginCoords() {
  return (arrow: ArrowCoords, adjusted: ScreenCoords) => {
    const factor = adjusted.main === 'left' ? 1 : -1

    return {
      top: arrow.top + _size,
      left: arrow.left + _size + factor * _sqrt,
    }
  }
}
