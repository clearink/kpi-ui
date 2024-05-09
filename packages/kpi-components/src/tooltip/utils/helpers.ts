import { clamp, fallback, isArray, isObject, isUndefined, ownerRoot } from '@kpi-ui/utils'
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

const arrow_size = 8
const arrow_sqrt = 5.66
const offset_x = 8
const offset_y = 4

/* ****************************** screen coords ****************************** */

export function getTopOrBottomScreenCoords(main: HorizontalMainAxis, cross: HorizontalCrossAxis) {
  return (options: GetScreenCoordsOptions): ScreenCoords => {
    const { triggerCoords: trigger, popupCoords: popup } = options

    const top = main === 'top' ? trigger.top - popup._height : trigger.bottom

    const delta = trigger.width - popup._width

    const left = trigger.left + (cross === 'left' ? 0 : cross === 'right' ? delta : delta / 2)

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
    const { triggerCoords: trigger, popupCoords: popup } = options

    const left = main === 'left' ? trigger.left - popup._width : trigger.right

    const delta = trigger.height - popup._height

    const top = trigger.top + (cross === 'top' ? 0 : cross === 'bottom' ? delta : delta / 2)

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

    const delta = trigger.width / 2 - offset_x - arrow_size

    const factor = cross === 'left' ? 1 : cross === 'right' ? -1 : 0

    return [left + factor * delta, delta] as const
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

    const delta = trigger.height / 2 - offset_y - arrow_size

    const factor = cross === 'top' ? 1 : cross === 'bottom' ? -1 : 0

    return [top + factor * delta, delta] as const
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

    // 还要考虑 trigger 元素本身的宽度
    const min = offset_x * 2 + arrow_size * 2 + popup._delta

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

    const min = offset_y * 2 + arrow_size * 2 + popup._delta

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

    console.log(popup._height)
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

    const delta = offset_x + arrow_size * 2

    let left = trigger.left - popup.left

    // const isKeepCenter = isObject(arrow) && arrow.pointAtCenter
    const min = Math.max(trigger.left, popup.left)

    const max = Math.min(trigger.right, popup.left + popup._width)

    const center = (min + max) / 2

    if (popup.cross === 'left') left += offset_x + popup._delta
    else if (popup.cross === 'right') left += trigger.width - delta - popup._delta
    // else if (isKeepCenter) left += trigger.width / 2 - arrow_size
    else {
      left = -popup.left + (max + min) / 2 - arrow_size
    }

    // center pointAtCenter = false 时，不一致

    return { top, left: clamp(left, offset_x, popup._width - delta) }
  }
}

export function getLeftOrRightArrowCoords() {
  return (options: GetArrowCoordsOptions) => {
    const { adjustedCoords: popup, contentCoords: content, triggerCoords: trigger } = options

    const left = popup.main === 'left' ? content._width - arrow_size : arrow_size / 2

    const delta = offset_y + arrow_size * 2

    let top = trigger.top - popup.top

    if (popup.cross === 'top') top += popup._delta
    else if (popup.cross === 'right') top += trigger.width - delta - popup._delta
    else top += trigger.height / 2 - arrow_size

    return { top: clamp(top, offset_y, popup._height - delta), left }
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
