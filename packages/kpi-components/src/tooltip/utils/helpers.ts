import { ownerRoot } from '@kpi-ui/utils'
// types
import type {
  ArrowCoords,
  ElementCoords,
  FlipPopupCoordsOptions,
  GetArrowCoordsOptions,
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
  return (trigger: ElementCoords, popup: ElementCoords): ScreenCoords => {
    const top = main === 'top' ? trigger.top - popup._height : trigger.bottom

    const left =
      cross === 'left'
        ? trigger.left
        : cross === 'right'
        ? trigger.right - popup._width
        : trigger.left + (trigger.width - popup._width) / 2

    return { top, left, _width: popup._width, _height: popup._height }
  }
}

export function getLeftOrRightScreenCoords(
  main: 'left' | 'right',
  cross: 'top' | 'center' | 'bottom'
) {
  return (trigger: ElementCoords, popup: ElementCoords): ScreenCoords => {
    const left = main === 'left' ? trigger.left - popup._width : trigger.right

    const top =
      cross === 'top'
        ? trigger.top
        : cross === 'bottom'
        ? trigger.bottom - popup._height
        : trigger.top + (trigger.height - popup._height) / 2

    return { top, left, _width: popup._width, _height: popup._height }
  }
}

export function getTopOrBottomArrowCoords(
  main: 'top' | 'bottom',
  cross: 'left' | 'center' | 'right'
) {
  return (options: GetArrowCoordsOptions) => {
    const { adjustedCoords: adjusted, contentCoords: content, triggerCoords: trigger } = options

    const top = main === 'top' ? content._height - arrow_size : arrow_size / 2

    let left = cross === 'left' ? offset_x : content._width - arrow_size * 2 - offset_x

    if (cross === 'center') {
      const min = Math.max(trigger.left, adjusted.left)

      const max = Math.min(trigger.right, adjusted.left + adjusted._width)

      left = (max + min) / 2 - adjusted.left - arrow_size
    }

    return { top, left }
  }
}

export function getLeftOrRightArrowCoords(
  main: 'left' | 'right',
  cross: 'top' | 'center' | 'bottom'
) {
  return (options: GetArrowCoordsOptions) => {
    const { adjustedCoords: adjusted, contentCoords: content, triggerCoords: trigger } = options

    const left = main === 'left' ? content._width - arrow_size : arrow_size / 2

    let top = cross === 'top' ? offset_y : content._height - arrow_size * 2 - offset_y

    if (cross === 'center') {
      const min = Math.max(trigger.top, adjusted.top)

      const max = Math.min(trigger.bottom, adjusted.top + adjusted._height)

      top = (max + min) / 2 - adjusted.top - arrow_size
    }

    return { top, left }
  }
}

export function getTopOrBottomOriginCoords(main: 'top' | 'bottom') {
  const factor = main === 'top' ? 1 : -1

  return (arrow: ArrowCoords) => ({
    top: arrow.top + arrow_size + factor * arrow_sqrt,
    left: arrow.left + arrow_size,
  })
}

export function getLeftOrRightOriginCoords(main: 'left' | 'right') {
  const factor = main === 'left' ? 1 : -1

  return (arrow: ArrowCoords) => ({
    top: arrow.top + arrow_size,
    left: arrow.left + arrow_size + factor * arrow_sqrt,
  })
}

/* ****************************** shift coords ****************************** */

// 调整上，下的水平方向
export function shiftTopOrBottomPopupCoords(cross: 'left' | 'center' | 'right') {
  const getLeftCoords = (options: ShiftPopupCoordsOptions) => {
    const { adjustedCoords: screen, triggerCoords: trigger, popupCoords: popup } = options

    if (cross === 'left' && screen.left > 0) return screen.left

    const min = offset_x * 2 + arrow_size * 2

    const max = ownerRoot(trigger.el).clientWidth - popup._width

    if (cross === 'right' && screen.left < max) return screen.left

    if (screen.left <= 0) return Math.min(trigger.right - min, 0)

    if (screen.left >= max) return Math.max(trigger.left - popup._width + min, max)

    return screen.left
  }

  return (options: ShiftPopupCoordsOptions): ScreenCoords => ({
    ...options.adjustedCoords,
    left: getLeftCoords(options),
  })
}

// 调整左，右的竖直方向
export function shiftLeftOrRightPopupCoords(cross: 'top' | 'center' | 'bottom') {
  const getTopCoords = (options: ShiftPopupCoordsOptions) => {
    const { adjustedCoords: screen, triggerCoords: trigger, popupCoords: popup } = options

    if (cross === 'top' && screen.top > 0) return screen.top

    const min = offset_y * 2 + arrow_size * 2

    const max = ownerRoot(trigger.el).clientHeight - popup._height

    if (cross === 'bottom' && screen.top < max) return screen.top

    if (screen.top <= 0) return Math.min(trigger.bottom - min, 0)

    if (screen.top >= max) return Math.max(trigger.top - popup._height + min, max)

    return screen.top
  }

  return (options: ShiftPopupCoordsOptions): ScreenCoords => ({
    ...options.adjustedCoords,
    top: getTopCoords(options),
  })
}

/* ****************************** flip coords ****************************** */

// 调整上，下的竖直方向
export function flipTopOrBottomPopupCoords(
  main: 'top' | 'bottom',
  cross: 'left' | 'center' | 'right'
) {
  const getTopCoords = (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: screen, triggerCoords: trigger, popupCoords: popup } = options

    // 下方必须要有多余的空间
    if (screen.top > 0) {
      const placement = `${main}${cross !== 'center' ? `-${cross}` : ''}`
      popup.el.dataset.popupPlacement = placement
      return screen.top
    }

    const placement = `${main === 'top' ? 'bottom' : 'top'}${cross !== 'center' ? `-${cross}` : ''}`

    popup.el.dataset.popupPlacement = placement

    return trigger.bottom
  }

  return (options: FlipPopupCoordsOptions) => ({
    ...options.adjustedCoords,
    top: getTopCoords(options),
  })
}

// 调整左，右的水平方向
export function flipLeftOrRightPopupCoords() {
  const getLeftCoords = (options: FlipPopupCoordsOptions) => {
    const { adjustedCoords: screen, triggerCoords: trigger } = options

    return screen.left
    // if (screen.top > 0) return screen.top

    // console.log('变成 bottomLeft')

    // return trigger.top + trigger.height
  }

  return (options: FlipPopupCoordsOptions) => ({
    ...options.adjustedCoords,
    left: getLeftCoords(options),
  })
}
