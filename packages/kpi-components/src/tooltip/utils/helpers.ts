import { fallback, isArray, isNumber, isObject, isUndefined, ownerRoot } from '@kpi-ui/utils'
// types
import type {
  AlignerConfig,
  ArrowCoords,
  ElementCoords,
  HorizontalCrossAxis,
  HorizontalMainAxis,
  PopupCoords,
  ScreenCoords,
  TooltipProps,
  VerticalCrossAxis,
  VerticalMainAxis,
} from '../props'

const _size = 8
const _sqrt = (_size / 2) * 1.41
const _px = _size
const _py = _size / 2
const _offset = _size / 2
const _effect = _size / 2

/* ****************************** screen coords ****************************** */

export function getTopOrBottomScreenCoords(
  main: HorizontalMainAxis,
  cross: HorizontalCrossAxis
): AlignerConfig['getScreenCoords'] {
  return (props, popup, trigger) => {
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

export function getLeftOrRightScreenCoords(
  main: VerticalMainAxis,
  cross: VerticalCrossAxis
): AlignerConfig['getScreenCoords'] {
  return (props, popup, trigger) => {
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
export function keepTopOrBottomArrowCenter(): AlignerConfig['keepArrowCenter'] {
  const getLeftCoords = (screen: ScreenCoords, trigger: ElementCoords) => {
    const { left, cross } = screen

    const dx = trigger.width / 2 - _px - _size

    const factor = cross === 'left' ? 1 : cross === 'right' ? -1 : 0

    return [left + factor * dx, dx] as const
  }

  return (props, screen, trigger) => {
    const { arrow } = props

    if (!(isObject(arrow) && arrow.pointAtCenter)) return screen

    const [left, _delta] = getLeftCoords(screen, trigger)

    return { ...screen, left, _delta }
  }
}

export function keepLeftOrRightArrowCenter(): AlignerConfig['keepArrowCenter'] {
  const getTopCoords = (popup: ScreenCoords, trigger: ElementCoords) => {
    const { top, cross } = popup

    const dy = trigger.height / 2 - _py - _size

    const factor = cross === 'top' ? 1 : cross === 'bottom' ? -1 : 0

    return [top + factor * dy, dy] as const
  }

  return (props, popup, trigger) => {
    const { arrow } = props

    if (!(isObject(arrow) && arrow.pointAtCenter)) return popup

    const [top, _delta] = getTopCoords(popup, trigger)

    return { ...popup, top, _delta }
  }
}

/* ****************************** popup offset ****************************** */

export function offsetPopupCoords({ offset }: TooltipProps, popup: ScreenCoords): ScreenCoords {
  const { top, left, main } = popup

  const [horizontal, vertical] = isArray(offset) ? [offset[0], offset[1]] : [offset, 0]

  const factor = main === 'top' || main === 'left' ? -1 : 1

  return {
    ...popup,
    top: top + (vertical || 0) * factor,
    left: left + (horizontal || 0) * factor,
  }
}

/* ****************************** shift coords ****************************** */

// 调整上，下的水平方向
export function shiftTopOrBottomPopupCoords(): AlignerConfig['shiftPopupCoords'] {
  const getLeftCoords = (popup: ScreenCoords, trigger: ElementCoords) => {
    const min = (_px + _size) * 2 + popup._delta

    const max = popup._mx - popup._width

    if (popup.left <= 0) return Math.min(trigger.right - min, 0)

    if (popup.left >= max) return Math.max(trigger.left - popup._width + min, max)
  }

  return (props, popup, trigger) => {
    const { shift } = props

    if (!shift || (isObject(shift) && shift.horizontal === false)) return popup

    const left = getLeftCoords(popup, trigger)

    return { ...popup, left: fallback(left, popup.left)! }
  }
}

// 调整左，右的竖直方向
export function shiftLeftOrRightPopupCoords(): AlignerConfig['shiftPopupCoords'] {
  const getTopCoords = (popup: ScreenCoords, trigger: ElementCoords) => {
    const min = (_py + _size) * 2 + popup._delta

    const max = popup._my - popup._height

    if (popup.top <= 0) return Math.min(trigger.bottom - min, 0)

    if (popup.top >= max) return Math.max(trigger.top - popup._height + min, max)
  }

  return (props, popup, trigger) => {
    const { shift } = props

    if (!shift || (isObject(shift) && shift.vertical === false)) return popup

    const top = getTopCoords(popup, trigger)

    return { ...popup, top: fallback(top, popup.top)! }
  }
}

/* ****************************** flip coords ****************************** */

// 翻转上，下主轴
export function flipTopOrBottomPopupCoords(): AlignerConfig['flipPopupCoords'] {
  const getTopCoords = (popup: ScreenCoords, trigger: ElementCoords) => {
    if (popup.main === 'top' && popup.top > 0) return

    const bottom = popup.top + popup._height

    if (popup.main === 'bottom' && bottom < popup._my) return

    // 保证有足够的空间 ？

    return trigger.bottom + trigger.top - bottom
  }

  return (props, popup, trigger) => {
    const { flip } = props

    if (!flip || (isObject(flip) && !flip.vertical)) return popup

    const top = getTopCoords(popup, trigger)

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
export function flipLeftOrRightPopupCoords(): AlignerConfig['flipPopupCoords'] {
  const getLeftCoords = (popup: ScreenCoords, trigger: ElementCoords) => {
    if (popup.main === 'left' && popup.left > 0) return

    const right = popup.left + popup._width

    if (popup.main === 'right' && right < popup._mx) return

    return trigger.right + trigger.left - right
  }

  return (props, popup, trigger) => {
    const { flip } = props

    if (!flip || (isObject(flip) && !flip.horizontal)) return popup

    const left = getLeftCoords(popup, trigger)

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

export function getTopOrBottomArrowCoords(): AlignerConfig['getArrowCoords'] {
  return (popup, trigger) => {
    const rotate = popup.main === 'top' ? 0 : 180

    const top = (popup.main === 'top' ? popup._height : 0) - _size

    const dx = _px + _size * 2

    const min = Math.max(trigger.left, popup.left - popup._delta)

    const max = Math.min(trigger.right, popup.left + popup._width + popup._delta)

    let left = -popup.left

    if (popup.cross === 'left') left += min + _px + popup._delta
    else if (popup.cross === 'right') left += max - dx - popup._delta
    else left += (max + min) / 2 - _size

    return { top, left, transform: `rotate(${rotate}deg)` }
  }
}

export function getLeftOrRightArrowCoords(): AlignerConfig['getArrowCoords'] {
  return (popup, trigger) => {
    const rotate = popup.main === 'left' ? 270 : 90

    const left = (popup.main === 'left' ? popup._width : 0) - _size

    const dy = _py + _size * 2

    const min = Math.max(trigger.top, popup.top - popup._delta)

    const max = Math.min(trigger.bottom, popup.top + popup._height + popup._delta)

    let top = -popup.top

    if (popup.cross === 'top') top += min + _py + popup._delta
    else if (popup.cross === 'bottom') top += max - dy - popup._delta
    else top += (max + min) / 2 - _size

    return { top, left, transform: `rotate(${rotate}deg)` }
  }
}

/* ****************************** origin coords ****************************** */

export function getTopOrBottomOriginCoords() {
  return (arrow: ArrowCoords, popup: ScreenCoords) => {
    const factor = popup.main === 'top' ? 1 : -1

    return {
      top: arrow.top + _size + factor * _sqrt,
      left: arrow.left + _size,
    }
  }
}

export function getLeftOrRightOriginCoords() {
  return (arrow: ArrowCoords, popup: ScreenCoords) => {
    const factor = popup.main === 'left' ? 1 : -1

    return {
      top: arrow.top + _size,
      left: arrow.left + _size + factor * _sqrt,
    }
  }
}

/* ****************************** coords getter ****************************** */

export function makeArrowCoordsGetter(curr: ArrowCoords) {
  return (prev: Partial<ArrowCoords>) => {
    const shouldUpdate = !isEqualCoords(prev, curr, ['top', 'left', 'transform'])

    return shouldUpdate ? curr : null
  }
}

export function makePopupCoordsGetter(curr: PopupCoords) {
  return (prev: Partial<PopupCoords>) => {
    const shouldUpdate = !isEqualCoords(prev, curr, ['top', 'left', '--origin-y', '--origin-x'])

    return shouldUpdate ? curr : null
  }
}

/* ****************************** coords equal ****************************** */

export function isEqualCoords(
  prev: Record<string, any>,
  curr: Record<string, any>,
  keys: string[]
) {
  const toString = (value: any) => (isNumber(value) ? value.toFixed(1) : value)

  return keys.every((key) => toString(prev[key]) === toString(curr[key]))
}
