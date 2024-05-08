import { fallback, isArray, isObject, isUndefined, ownerRoot } from '@kpi-ui/utils'
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
      _mx: root.clientWidth,
      _my: root.clientHeight,
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
      _mx: root.clientWidth,
      _my: root.clientHeight,
    }
  }
}

/* ****************************** arrow center ****************************** */
export function keepTopOrBottomArrowCenter() {
  const getLeftCoords = (options: KeepArrowCenterOptions) => {
    // prettier-ignore
    const { adjustedCoords: { left, cross }, triggerCoords: trigger } = options

    const delta = trigger.width / 2 - offset_x - arrow_size

    const factor = cross === 'left' ? 1 : cross === 'right' ? -1 : 0

    return left + factor * delta
  }

  return (options: KeepArrowCenterOptions) => {
    // prettier-ignore
    const { props: { arrow }, adjustedCoords: popup } = options

    if (!(isObject(arrow) && arrow.pointAtCenter)) return popup

    return { ...popup, left: getLeftCoords(options) }
  }
}

export function keepLeftOrRightArrowCenter() {
  const getTopCoords = (options: KeepArrowCenterOptions) => {
    // prettier-ignore
    const { adjustedCoords: { top, cross }, triggerCoords: trigger } = options

    const delta = trigger.height / 2 - offset_y - arrow_size

    const factor = cross === 'top' ? 1 : cross === 'bottom' ? -1 : 0

    return top + factor * delta
  }

  return (options: KeepArrowCenterOptions) => {
    // prettier-ignore
    const { props: { arrow }, adjustedCoords: popup } = options

    if (!(isObject(arrow) && arrow.pointAtCenter)) return popup

    return { ...popup, top: getTopCoords(options) }
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

    // 还要考虑 trigger 元素本身的宽度
    const min = offset_x * 2 + arrow_size * 2

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

    const min = offset_y * 2 + arrow_size * 2

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

    const popupBottom = popup.top + popup._height

    if (popup.main === 'bottom' && popupBottom < popup._my) return

    return trigger.bottom + trigger.top - popupBottom
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
    const { adjustedCoords: popup, contentCoords: content, triggerCoords: trigger } = options

    const top = popup.main === 'top' ? content._height - arrow_size : arrow_size / 2

    const delta = trigger.width / 2 - offset_x - arrow_size

    const factor = popup.cross === 'left' ? 1 : popup.cross === 'right' ? -1 : 0
    // min 与 max 的计算方式有问题
    const min = Math.max(trigger.left, popup.left)

    const max = Math.min(trigger.right, popup.left + popup._width)

    // arrow 应当以adjustedCords 为基准

    // const left = offset_x + Math.max(trigger.left - popup.left, 0)
    // const left = popup._width - offset_x - arrow_size * 2

    // if (cross === 'left') left = triggerCenter - popup.left - offset_x

    let left = -popup.left

    if (popup.cross === 'left') left += min + offset_x
    else if (popup.cross === 'center') left += (max + min) / 2 - arrow_size
    else left += max - arrow_size * 2 - offset_x

    // left += factor * delta

    // left = clamp(left, offset_x, popup._width - offset_x - arrow_size * 2)
    // console.log(left, min - popup.left)

    return { top, left }
  }
}

export function getLeftOrRightArrowCoords() {
  return (options: GetArrowCoordsOptions) => {
    const { adjustedCoords: popup, contentCoords: content, triggerCoords: trigger } = options

    const left = popup.main === 'left' ? content._width - arrow_size : arrow_size / 2

    const min = Math.max(trigger.top, popup.top)

    const max = Math.min(trigger.bottom, popup.top + popup._height)

    let top = -popup.top

    if (popup.cross === 'top') top += min + offset_y
    else if (popup.cross === 'center') top += (max + min) / 2 - arrow_size
    else top += max - arrow_size * 2 - offset_y

    return { top, left }
  }
}

/* ****************************** origin coords ****************************** */

export function getTopOrBottomOriginCoords() {
  return (arrow: ArrowCoords, adjusted: ScreenCoords) => {
    const factor = adjusted.main === 'top' ? 1 : -1

    return {
      top: arrow.top + arrow_size + factor * arrow_sqrt,
      left: arrow.left + arrow_size,
    }
  }
}

export function getLeftOrRightOriginCoords() {
  return (arrow: ArrowCoords, adjusted: ScreenCoords) => {
    const factor = adjusted.main === 'left' ? 1 : -1

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
