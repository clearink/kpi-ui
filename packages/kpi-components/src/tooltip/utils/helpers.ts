import { isArray, isUndefined, ownerRoot } from '@kpi-ui/utils'
// types
import type {
  ArrowCoords,
  FlipPopupCoordsOptions,
  GetArrowCoordsOptions,
  GetScreenCoordsOptions,
  MakeArrowCenterOptions,
  ScreenCoords,
  ShiftPopupCoordsOptions,
  TooltipProps,
} from '../props'

const arrow_size = 8
const arrow_sqrt = 5.66
const offset_x = 8
const offset_y = 4

/* ****************************** screen coords ****************************** */

export function getTopOrBottomScreenCoords(
  main: 'top' | 'bottom',
  cross: 'left' | 'center' | 'right'
) {
  return (options: GetScreenCoordsOptions): ScreenCoords => {
    const { triggerCoords: trigger, popupCoords: popup } = options

    const top = main === 'top' ? trigger.top - popup._height : trigger.bottom

    const left =
      cross === 'left'
        ? trigger.left
        : cross === 'right'
        ? trigger.right - popup._width
        : trigger.left + (trigger.width - popup._width) / 2

    return {
      top,
      left,
      _width: popup._width,
      _height: popup._height,
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
    const { triggerCoords: trigger, popupCoords: popup } = options

    const left = main === 'left' ? trigger.left - popup._width : trigger.right

    const top =
      cross === 'top'
        ? trigger.top
        : cross === 'bottom'
        ? trigger.bottom - popup._height
        : trigger.top + (trigger.height - popup._height) / 2

    return {
      top,
      left,
      _width: popup._width,
      _height: popup._height,
      main,
      cross,
    }
  }
}

/* ****************************** arrow center ****************************** */
export function makeTopOrBottomArrowCenter(cross: 'left' | 'center' | 'right') {
  return (options: MakeArrowCenterOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    const deltaValue = trigger.width / 2 - offset_x - arrow_size

    const left =
      cross === 'left'
        ? popup.left + deltaValue
        : cross === 'right'
        ? popup.left - deltaValue
        : popup.left

    return { ...popup, left }
  }
}

export function makeLeftOrRightArrowCenter(cross: 'top' | 'center' | 'bottom') {
  return (options: MakeArrowCenterOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    const deltaValue = trigger.height / 2 - offset_y - arrow_size

    const top =
      cross === 'top'
        ? popup.top + deltaValue
        : cross === 'bottom'
        ? popup.top - deltaValue
        : popup.top

    return { ...popup, top }
  }
}

/* ****************************** popup offset ****************************** */

export function offsetPopupCoords(adjustedCoords: ScreenCoords, offset: TooltipProps['offset']) {
  const [horizontal, vertical] = isArray(offset) ? [offset[0], offset[1]] : [offset, 0]

  const factor = adjustedCoords.main === 'top' || adjustedCoords.main === 'left' ? -1 : 1

  return {
    ...adjustedCoords,
    top: adjustedCoords.top + (vertical || 0) * factor,
    left: adjustedCoords.left + (horizontal || 0) * factor,
  }
}

/* ****************************** shift coords ****************************** */

// 调整上，下的水平方向
export function shiftTopOrBottomPopupCoords() {
  const getLeftCoords = (options: ShiftPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    const min = offset_x * 2 + arrow_size * 2

    const max = ownerRoot(trigger.el).clientWidth - popup._width

    if (popup.left <= 0) return Math.min(trigger.right - min, 0)

    // 是否需要进行翻转?

    if (popup.left >= max) return Math.max(trigger.left - popup._width + min, max)
  }

  return (options: ShiftPopupCoordsOptions): ScreenCoords => {
    const { adjustedCoords: popup } = options

    const left = getLeftCoords(options)

    const shifted = !isUndefined(left)

    return {
      ...popup,
      left: shifted ? left : popup.left,
    }
  }
}

// 调整左，右的竖直方向
export function shiftLeftOrRightPopupCoords() {
  const getTopCoords = (options: ShiftPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    const min = offset_y * 2 + arrow_size * 2

    const max = ownerRoot(trigger.el).clientHeight - popup._height

    if (popup.top <= 0) return Math.min(trigger.bottom - min, 0)

    if (popup.top >= max) return Math.max(trigger.top - popup._height + min, max)
  }

  return (options: ShiftPopupCoordsOptions): ScreenCoords => {
    const { adjustedCoords: popup } = options

    const top = getTopCoords(options)

    const shifted = !isUndefined(top)

    return {
      ...popup,
      top: shifted ? top : popup.top,
    }
  }
}

/* ****************************** flip coords ****************************** */

// 翻转上，下的竖直方向
export function flipTopOrBottomPopupCoords(main: 'top' | 'bottom') {
  const flippedAxis = main === 'top' ? 'bottom' : 'top'

  const getTopCoords = (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    if (main === 'top' && popup.top > 0) return

    const rootHeight = ownerRoot(trigger.el).clientHeight

    const popupBottom = popup.top + popup._height

    if (main === 'bottom' && popupBottom < rootHeight) return

    return trigger.bottom + trigger.top - popupBottom
  }

  return (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: popup } = options

    const top = getTopCoords(options)

    const flipped = !isUndefined(top)

    return {
      ...popup,
      top: flipped ? top : popup.top,
      main: flipped ? flippedAxis : main,
    }
  }
}

// 翻转左，右的水平方向
export function flipLeftOrRightPopupCoords(main: 'left' | 'right') {
  const flippedAxis = main === 'left' ? 'right' : 'left'

  const getLeftCoords = (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    if (main === 'left' && popup.left > 0) return

    const rootWidth = ownerRoot(trigger.el).clientWidth

    const popupRight = popup.left + popup._width

    if (main === 'right' && popupRight < rootWidth) return

    return trigger.right + trigger.left - popupRight
  }

  return (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: popup } = options

    const left = getLeftCoords(options)

    const flipped = !isUndefined(left)

    return {
      ...popup,
      left: flipped ? left : popup.left,
      main: flipped ? flippedAxis : main,
    }
  }
}

/* ****************************** arrow coords ****************************** */

export function getTopOrBottomArrowCoords(cross: 'left' | 'center' | 'right') {
  return (options: GetArrowCoordsOptions) => {
    const { adjustedCoords: popup, contentCoords: content, triggerCoords: trigger } = options

    const top = popup.main === 'top' ? content._height - arrow_size : arrow_size / 2

    const min = Math.max(trigger.left, popup.left)

    const max = Math.min(trigger.right, popup.left + popup._width)

    let left = -popup.left

    if (cross === 'left') left += min + offset_x
    else if (cross === 'center') left += (max + min) / 2 - arrow_size
    else left += max - arrow_size * 2 - offset_x

    return { top, left }
  }
}

export function getLeftOrRightArrowCoords(cross: 'top' | 'center' | 'bottom') {
  return (options: GetArrowCoordsOptions) => {
    const { adjustedCoords: popup, contentCoords: content, triggerCoords: trigger } = options

    const left = popup.main === 'left' ? content._width - arrow_size : arrow_size / 2

    const min = Math.max(trigger.top, popup.top)

    const max = Math.min(trigger.bottom, popup.top + popup._height)

    let top = -popup.top

    if (cross === 'top') top += min + offset_y
    else if (cross === 'center') top += (max + min) / 2 - arrow_size
    else top += max - arrow_size * 2 - offset_y

    return { top, left }
  }
}

/* ****************************** origin coords ****************************** */

export function getTopOrBottomOriginCoords(main: 'top' | 'bottom') {
  return (arrow: ArrowCoords, adjusted: ScreenCoords) => {
    const factor = adjusted.main === main ? 1 : -1

    return {
      top: arrow.top + arrow_size + factor * arrow_sqrt,
      left: arrow.left + arrow_size,
    }
  }
}

export function getLeftOrRightOriginCoords(main: 'left' | 'right') {
  return (arrow: ArrowCoords, adjusted: ScreenCoords) => {
    const factor = adjusted.main === main ? 1 : -1

    return {
      top: arrow.top + arrow_size,
      left: arrow.left + arrow_size + factor * arrow_sqrt,
    }
  }
}

/* ****************************** popup placement ****************************** */

export function updatePopupPlacement(el: HTMLElement, adjustedCoords: ScreenCoords) {
  const { main, cross } = adjustedCoords

  const second = cross !== 'center' ? `-${cross}` : ''

  const placement = `${main}${second}`

  if (el.dataset) el.dataset.popupPlacement = placement
  else el.setAttribute('data-popup-placement', placement)
}
