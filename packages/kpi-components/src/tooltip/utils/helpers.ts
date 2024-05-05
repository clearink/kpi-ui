import { isObjectLike, isUndefined, ownerRoot, shallowEqual } from '@kpi-ui/utils'
// types
import type {
  ArrowCoords,
  ElementCoords,
  FlipPopupCoordsOptions,
  GetArrowCoordsOptions,
  GetScreenCoordsOptions,
  ScreenCoords,
  ShiftPopupCoordsOptions,
} from '../props'

const arrow_size = 8
const arrow_sqrt = 5.66
const offset_x = 8
const offset_y = 4

/* ****************************** get coords ****************************** */

export function getTopOrBottomScreenCoords(
  main: 'top' | 'bottom',
  cross: 'left' | 'center' | 'right'
) {
  return (options: GetScreenCoordsOptions): ScreenCoords => {
    const { triggerCoords: trigger, popupCoords: popup, props } = options

    const { arrow } = props
    const isForceCenter = isObjectLike(arrow) && arrow.pointAtCenter

    const top = main === 'top' ? trigger.top - popup._height : trigger.bottom

    // trigger 的中心
    const center = (trigger.right + trigger.left) / 2

    let left: number

    if (cross === 'left') {
      left = isForceCenter ? center - arrow_size - offset_x : trigger.left
    } else if (cross === 'center') {
      left = trigger.left + (trigger.width - popup._width) / 2
    } else {
      left = isForceCenter
        ? center - popup._width + arrow_size + offset_x
        : trigger.right - popup._width
    }

    return {
      top,
      left,
      _width: popup._width,
      _height: popup._height,
      flipped: false,
      shifted: false,
      main,
      cross,
    }
  }
}

export function getLeftOrRightScreenCoords(
  main: 'left' | 'right',
  cross: 'top' | 'center' | 'bottom'
) {
  return (options: GetScreenCoordsOptions): ScreenCoords => {
    const { triggerCoords: trigger, popupCoords: popup, props } = options

    const { arrow } = props
    const isForceCenter = isObjectLike(arrow) && arrow.pointAtCenter

    const left = main === 'left' ? trigger.left - popup._width : trigger.right

    // trigger 的中心
    const center = (trigger.bottom + trigger.top) / 2

    let top: number

    if (cross === 'top') {
      top = isForceCenter ? center - arrow_size - offset_y : trigger.top
    } else if (cross === 'center') {
      top = trigger.top + (trigger.height - popup._height) / 2
    } else {
      top = isForceCenter
        ? center - popup._height + arrow_size + offset_y
        : trigger.bottom - popup._height
    }

    return {
      top,
      left,
      _width: popup._width,
      _height: popup._height,
      flipped: false,
      shifted: false,
      main,
      cross,
    }
  }
}

export function getTopOrBottomArrowCoords(
  main: 'top' | 'bottom',
  cross: 'left' | 'center' | 'right'
) {
  return (options: GetArrowCoordsOptions) => {
    const { adjustedCoords: screen, contentCoords: content, triggerCoords: trigger } = options

    const top = shallowEqual(main === 'top', screen.flipped)
      ? arrow_size / 2
      : content._height - arrow_size

    const min = Math.max(trigger.left, screen.left)

    const max = Math.min(trigger.right, screen.left + screen._width)

    let left = -screen.left

    if (cross === 'left') left += min + offset_x
    else if (cross === 'center') left += (max + min) / 2 - arrow_size
    else left += max - arrow_size * 2 - offset_x

    return { top, left }
  }
}

export function getLeftOrRightArrowCoords(
  main: 'left' | 'right',
  cross: 'top' | 'center' | 'bottom'
) {
  return (options: GetArrowCoordsOptions) => {
    const { adjustedCoords: screen, contentCoords: content, triggerCoords: trigger } = options

    const left = shallowEqual(main === 'left', screen.flipped)
      ? arrow_size / 2
      : content._width - arrow_size

    const min = Math.max(trigger.top, screen.top)

    const max = Math.min(trigger.bottom, screen.top + screen._height)

    let top = -screen.top

    if (cross === 'top') top += min + offset_y
    else if (cross === 'center') top += (max + min) / 2 - arrow_size
    else top += max - arrow_size * 2 - offset_y

    return { top, left }
  }
}

export function getTopOrBottomOriginCoords(main: 'top' | 'bottom') {
  return (arrow: ArrowCoords, flipped: boolean) => {
    const factor = shallowEqual(main === 'top', flipped) ? -1 : 1

    return {
      top: arrow.top + arrow_size + factor * arrow_sqrt,
      left: arrow.left + arrow_size,
    }
  }
}

export function getLeftOrRightOriginCoords(main: 'left' | 'right') {
  return (arrow: ArrowCoords, flipped: boolean) => {
    const factor = shallowEqual(main === 'left', flipped) ? -1 : 1

    return {
      top: arrow.top + arrow_size,
      left: arrow.left + arrow_size + factor * arrow_sqrt,
    }
  }
}

/* ****************************** shift coords ****************************** */

// 调整上，下的水平方向
export function shiftTopOrBottomPopupCoords() {
  const getLeftCoords = (options: ShiftPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    const start = offset_x * 2 + arrow_size * 2

    const end = ownerRoot(trigger.el).clientWidth - popup._width

    if (popup.left <= 0) return Math.min(trigger.right - start, 0)

    if (popup.left >= end) return Math.max(trigger.left - popup._width + start, end)
  }

  return (options: ShiftPopupCoordsOptions): ScreenCoords => {
    const { adjustedCoords: popup } = options

    const left = getLeftCoords(options)

    const shifted = !isUndefined(left)

    return {
      ...popup,
      left: shifted ? left : popup.left,
      shifted,
    }
  }
}

// 调整左，右的竖直方向
export function shiftLeftOrRightPopupCoords() {
  const getTopCoords = (options: ShiftPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    const start = offset_y * 2 + arrow_size * 2

    const end = ownerRoot(trigger.el).clientHeight - popup._height

    if (popup.top <= 0) return Math.min(trigger.bottom - start, 0)

    if (popup.top >= end) return Math.max(trigger.top - popup._height + start, end)
  }

  return (options: ShiftPopupCoordsOptions): ScreenCoords => {
    const { adjustedCoords: popup } = options

    const top = getTopCoords(options)

    const shifted = !isUndefined(top)

    return {
      ...popup,
      top: shifted ? top : popup.top,
      shifted,
    }
  }
}

/* ****************************** flip coords ****************************** */

// 翻转上，下的竖直方向
export function flipTopOrBottomPopupCoords(main: 'top' | 'bottom') {
  const getTopCoords = (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    // 下方必须要有多余的空间
    if (main === 'top') return popup.top > 0 ? undefined : trigger.bottom

    const rootHeight = ownerRoot(trigger.el).clientHeight

    // 下方必须要有多余的空间
    if (popup.top + popup._height < rootHeight) return

    return trigger.top - popup._height
  }

  return (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: popup } = options

    const top = getTopCoords(options)

    const flipped = !isUndefined(top)

    return {
      ...popup,
      top: flipped ? top : popup.top,
      flipped,
    }
  }
}

// 翻转左，右的水平方向
export function flipLeftOrRightPopupCoords(main: 'left' | 'right') {
  const getLeftCoords = (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    if (main === 'left') return popup.left > 0 ? undefined : trigger.right

    const rootWidth = ownerRoot(trigger.el).clientWidth

    if (popup.left + popup._width < rootWidth) return

    return trigger.left - popup._width
  }

  return (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: popup } = options

    const left = getLeftCoords(options)

    const flipped = !isUndefined(left)

    return {
      ...popup,
      left: flipped ? left : popup.left,
      flipped,
    }
  }
}

export function updatePopupPlacement(el: HTMLElement, adjustedCoords: ScreenCoords) {
  const { flipped, main, cross } = adjustedCoords

  // 是否可以优化逻辑?
  let first = main

  if (flipped && main === 'top') first = 'bottom'
  else if (flipped && main === 'bottom') first = 'top'
  else if (flipped && main === 'left') first = 'right'
  else if (flipped && main === 'right') first = 'left'

  const second = cross !== 'center' ? `-${cross}` : ''

  const placement = `${first}${second}`

  if (el.dataset) el.dataset.popupPlacement = placement
  else el.setAttribute('data-popup-placement', placement)
}
