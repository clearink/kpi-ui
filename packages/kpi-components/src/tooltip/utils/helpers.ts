import { fallback, isArray, isObjectLike, isUndefined, ownerRoot } from '@kpi-ui/utils'
// types
import type {
  ArrowCoords,
  FlipPopupCoordsOptions,
  GetArrowCoordsOptions,
  GetScreenCoordsOptions,
  KeepArrowCenterOptions,
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

    const root = ownerRoot(trigger.el)

    return {
      top,
      left,
      main,
      cross,
      _width: popup._width,
      _height: popup._height,
      _rootWidth: root.clientWidth,
      _rootHeight: root.clientHeight,
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

    const root = ownerRoot(trigger.el)

    return {
      top,
      left,
      main,
      cross,
      _width: popup._width,
      _height: popup._height,
      _rootWidth: root.clientWidth,
      _rootHeight: root.clientHeight,
    }
  }
}

/* ****************************** arrow center ****************************** */
export function keepTopOrBottomArrowCenter(cross: 'left' | 'center' | 'right') {
  return (options: KeepArrowCenterOptions) => {
    const { props, adjustedCoords: popup, triggerCoords: trigger } = options

    const { arrow } = props

    const shouldKeepCenter = isObjectLike(arrow) && arrow.pointAtCenter

    if (!shouldKeepCenter) return popup

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

export function keepLeftOrRightArrowCenter(cross: 'top' | 'center' | 'bottom') {
  return (options: KeepArrowCenterOptions) => {
    const { props, adjustedCoords: popup, triggerCoords: trigger } = options

    const { arrow } = props

    const shouldKeepCenter = isObjectLike(arrow) && arrow.pointAtCenter

    if (!shouldKeepCenter) return popup

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
export function shiftTopOrBottomPopupCoords(cross: 'left' | 'center' | 'right') {
  const getLeftCoords = (options: ShiftPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    const min = offset_x * 2 + arrow_size * 2

    const max = popup._rootWidth - popup._width

    if (popup.left <= 0) return Math.min(trigger.right - min, 0)

    if (popup.left >= max) return Math.max(trigger.left - popup._width + min, max)
  }

  return (options: ShiftPopupCoordsOptions): ScreenCoords => {
    // prettier-ignore
    const { props: { shift }, adjustedCoords: popup } = options

    if (!shift || (isObjectLike(shift) && !shift.horizontal)) return popup

    const left = getLeftCoords(options)

    return { ...popup, left: fallback(left, popup.left)! }
  }
}

// 调整左，右的竖直方向
export function shiftLeftOrRightPopupCoords(cross: 'top' | 'center' | 'bottom') {
  const getTopCoords = (options: ShiftPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    const min = offset_y * 2 + arrow_size * 2

    const max = popup._rootHeight - popup._height

    if (popup.top <= 0) return Math.min(trigger.bottom - min, 0)

    if (popup.top >= max) return Math.max(trigger.top - popup._height + min, max)
  }

  return (options: ShiftPopupCoordsOptions): ScreenCoords => {
    // prettier-ignore
    const { props: { shift }, adjustedCoords: popup } = options

    if (!shift || (isObjectLike(shift) && !shift.vertical)) return popup

    const top = getTopCoords(options)

    return { ...popup, top: fallback(top, popup.top)! }
  }
}

/* ****************************** flip coords ****************************** */

// 翻转上，下主轴
export function flipTopOrBottomPopupCoords(
  main: 'top' | 'bottom',
  cross: 'left' | 'center' | 'right'
) {
  const _main = main === 'top' ? 'bottom' : 'top'
  const _cross = cross === 'left' ? 'right' : cross === 'right' ? 'left' : 'center'

  // 准的
  const getTopCoords = (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    if (main === 'top' && popup.top > 0) return

    const popupBottom = popup.top + popup._height

    if (main === 'bottom' && popupBottom < popup._rootHeight) return

    return trigger.bottom + trigger.top - popupBottom
  }

  const getLeftCoords = (options: ShiftPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    const tt = offset_x * 2 + arrow_size * 2

    const max = popup._rootWidth - popup._width

    if (cross === 'left' && popup.left >= popup._rootWidth - popup._width) {
      return Math.max(Math.min(trigger.right, popup._rootWidth), trigger.left + tt) - popup._width
    }

    if (cross === 'right' && popup.left <= 0) {
      return Math.min(Math.max(trigger.left, 0), trigger.right - tt)
    }
  }

  return (options: FlipPopupCoordsOptions) => {
    const { props, adjustedCoords: popup } = options

    const { flip } = props

    const top = getTopCoords(options)

    const flippedMain = !isUndefined(top)

    const left = getLeftCoords(options)

    const flippedCross = !isUndefined(left)

    return {
      ...popup,
      top: flippedMain ? top : popup.top,
      main: flippedMain ? _main : main,
      left: flippedCross ? left : popup.left,
      cross: flippedCross ? _cross : popup.cross,
    }
  }
}

// 翻转左，右主轴
export function flipLeftOrRightPopupCoords(
  main: 'left' | 'right',
  cross: 'top' | 'center' | 'bottom'
) {
  const flippedMainAxis = main === 'left' ? 'right' : 'left'
  const flippedCrossAxis = cross === 'top' ? 'bottom' : cross === 'bottom' ? 'top' : 'center'

  // 准的
  const getLeftCoords = (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    if (main === 'left' && popup.left > 0) return

    const popupRight = popup.left + popup._width

    if (main === 'right' && popupRight < popup._rootWidth) return

    return trigger.right + trigger.left - popupRight
  }

  const getTopCoords = (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: popup, triggerCoords: trigger } = options

    if (cross === 'top' && popup.top > 0) return

    const popupRight = popup.left + popup._width

    if (main === 'right' && popupRight < popup._rootWidth) return

    return trigger.right + trigger.left - popupRight
  }

  return (options: FlipPopupCoordsOptions) => {
    const { props, adjustedCoords: popup } = options

    const { flip } = props

    // const shouldFlipPopup =

    const top = getTopCoords(options)

    const flippedMain = !isUndefined(top)

    const left = getLeftCoords(options)

    const flippedCross = !isUndefined(left)

    return {
      ...popup,
      top: flippedMain ? top : popup.top,
      main: flippedMain ? flippedMainAxis : main,
      left: flippedCross ? left : popup.left,
      cross: flippedCross ? flippedCrossAxis : popup.cross,
    }
  }
}

/* ****************************** arrow coords ****************************** */

export function getTopOrBottomArrowCoords(cross: 'left' | 'center' | 'right') {
  return (options: GetArrowCoordsOptions) => {
    const { adjustedCoords: popup, contentCoords: content, triggerCoords: trigger } = options

    const top = popup.main === 'top' ? content._height - arrow_size : arrow_size / 2

    // min 与 max 的计算方式有问题
    const min = Math.min(trigger.left, popup.left)

    const max = Math.max(trigger.right, popup.left + popup._width)

    // arrow 应当以adjustedCords 为基准

    const triggerCenter = trigger.left + trigger.width / 2

    const popupCenter = popup.left + popup._width / 2

    // const left = offset_x + Math.max(trigger.left - popup.left, 0)
    const left = popup._width - offset_x - arrow_size * 2

    // if (cross === 'left') left = triggerCenter - popup.left - offset_x

    // let left = -popup.left

    // if (cross === 'left') left += min + offset_x
    // else if (cross === 'center') left += (max + min) / 2 - arrow_size
    // else left += max - arrow_size * 2 - offset_x

    // left = clamp(left, offset_x, popup._width - offset_x - arrow_size * 2)
    // console.log(left, min - popup.left)

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

export function updatePopupPlacement(el: HTMLElement, { main, cross }: ScreenCoords) {
  const placement = `${main}${cross !== 'center' ? `-${cross}` : ''}`

  el.dataset.popupPlacement = placement
}
