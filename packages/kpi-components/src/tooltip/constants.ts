import { getElementCoords } from './utils/coords'

interface GetCoordsOptions {
  relative: ReturnType<typeof getElementCoords>
  popup: ReturnType<typeof getElementCoords>
  trigger: ReturnType<typeof getElementCoords>
}

// TODO: 去除魔术字符串

export const TOOLTIP_PLACEMENT = {
  topLeft: {
    getPopupCoords: (options: GetCoordsOptions) => {
      const { popup, trigger, relative } = options

      // 相对于屏幕的坐标
      const screenCoords = {
        top: trigger.coords.top - popup.height,
        left: trigger.coords.left,
      }

      // 相对于定位元素
      return {
        top: screenCoords.top - relative.coords.top,
        left: screenCoords.left - relative.coords.left,
      }
    },
    shouldFlipCoords: () => {
      // 当 trigger 对应的 placement 不能容纳 popup 时需要 flip
      // 是直接 trigger.getBoundingClientRect 还是
      return false
    },
    flipPopupCoords: (options: { left: number; top: number }) => {
      const { left } = options
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
  },
  // top: {
  //   getTooltipCoords: (options: GetCoordsOptions) => {
  //     const { popup, trigger, positioned } = options

  //     const _positioned = getElementCoords(positioned)

  //     const _trigger = getElementCoords(trigger)

  //     const _popup = getElementCoords(popup)

  //     const arrow_size = 8
  //     const arrow_offset_x = _popup.clientWidth / 2
  //     const arrow_offset_y = _popup.clientHeight - arrow_size

  //     return {
  //       top: _trigger.top - _popup.clientHeight - _positioned.top,
  //       left: _trigger.left + (_trigger.width - _popup.clientWidth) / 2 - _positioned.left,
  //       '--origin-x': `${arrow_offset_x}px`,
  //       '--origin-y': `${arrow_offset_y}px`,
  //     }
  //   },
  //   getArrowCoords: (options: GetCoordsOptions) => {
  //     return {}
  //   },
  //   flipCoords: () => {},
  // },
  // topRight: {
  //   getTooltipCoords: (options: GetCoordsOptions) => {
  //     const { popup, trigger, positioned } = options

  //     const _positioned = getElementCoords(positioned)

  //     const _trigger = getElementCoords(trigger)

  //     const _popup = getElementCoords(popup)

  //     const arrow_size = 8
  //     const arrow_offset_x = _popup.clientWidth - arrow_size * 2
  //     const arrow_offset_y = _popup.clientHeight - arrow_size

  //     return {
  //       top: _trigger.top - _popup.clientHeight - _positioned.top,
  //       left: _trigger.left + (_trigger.width - _popup.clientWidth) - _positioned.left,
  //       '--origin-x': `${arrow_offset_x}px`,
  //       '--origin-y': `${arrow_offset_y}px`,
  //     }
  //   },
  //   getArrowCoords: (options: GetCoordsOptions) => {
  //     return {}
  //   },
  //   flipCoords: () => {},
  // },
  // rightTop: {
  //   getTooltipCoords: (options: GetCoordsOptions) => {
  //     const { trigger, positioned, arrow } = options

  //     const _positioned = positioned.getBoundingClientRect()

  //     const _trigger = trigger.getBoundingClientRect()

  //     const _arrowWidth = arrow ? arrow.clientWidth : 4

  //     return {
  //       top: _trigger.top - _positioned.top,
  //       left: _trigger.right + _arrowWidth - _positioned.left,
  //     }
  //   },
  //   getArrowCoords: (options: GetCoordsOptions) => {
  //     return {}
  //   },
  //   flipCoords: () => {},
  // },
  // right: {
  //   getTooltipCoords: (options: GetCoordsOptions) => {
  //     const { trigger, tooltip, positioned, arrow } = options

  //     const _positioned = positioned.getBoundingClientRect()

  //     const _trigger = trigger.getBoundingClientRect()

  //     const _arrowWidth = arrow ? arrow.clientWidth : 4

  //     return {
  //       top: _trigger.top + (_trigger.height - tooltip.clientHeight) / 2 - _positioned.top,
  //       left: _trigger.right + _arrowWidth - _positioned.left,
  //     }
  //   },
  //   getArrowCoords: (options: GetCoordsOptions) => {
  //     return {}
  //   },
  //   flipCoords: () => {},
  // },
  // rightBottom: {
  //   getTooltipCoords: (options: GetCoordsOptions) => {
  //     const { trigger, tooltip, positioned, arrow } = options

  //     const _positioned = positioned.getBoundingClientRect()

  //     const _trigger = trigger.getBoundingClientRect()

  //     const _arrowWidth = arrow ? arrow.clientWidth : 4

  //     return {
  //       top: _trigger.bottom - tooltip.clientHeight - _positioned.top,
  //       left: _trigger.right + _arrowWidth - _positioned.left,
  //     }
  //   },
  //   getArrowCoords: (options: GetCoordsOptions) => {
  //     return {}
  //   },
  //   flipCoords: () => {},
  // },
  // bottomLeft: {
  //   getTooltipCoords: (options: GetCoordsOptions) => {
  //     const { trigger, positioned, arrow } = options

  //     const _positioned = positioned.getBoundingClientRect()

  //     const _trigger = trigger.getBoundingClientRect()

  //     const _arrowHeight = arrow ? arrow.clientHeight : 4

  //     return {
  //       top: _trigger.bottom + _arrowHeight - _positioned.top,
  //       left: _trigger.left - _positioned.left,
  //     }
  //   },
  //   getArrowCoords: (options: GetCoordsOptions) => {
  //     return {}
  //   },
  //   flipCoords: () => {},
  // },
  // bottom: {
  //   getTooltipCoords: (options: GetCoordsOptions) => {
  //     const { trigger, tooltip, positioned, arrow } = options

  //     const _positioned = positioned.getBoundingClientRect()

  //     const _trigger = trigger.getBoundingClientRect()

  //     const _arrowHeight = arrow ? arrow.clientHeight : 4

  //     return {
  //       top: _trigger.bottom + _arrowHeight - _positioned.top,
  //       left: _trigger.left + (_trigger.width - tooltip.clientWidth) / 2 - _positioned.left,
  //     }
  //   },
  //   getArrowCoords: (options: GetCoordsOptions) => {
  //     return {}
  //   },
  //   flipCoords: () => {},
  // },
  // bottomRight: {
  //   getTooltipCoords: (options: GetCoordsOptions) => {
  //     const { trigger, tooltip, positioned, arrow } = options

  //     const _positioned = positioned.getBoundingClientRect()

  //     const _trigger = trigger.getBoundingClientRect()

  //     const _arrowHeight = arrow ? arrow.clientHeight : 4

  //     return {
  //       top: _trigger.bottom + _arrowHeight - _positioned.top,
  //       left: _trigger.right - tooltip.clientWidth - _positioned.left,
  //     }
  //   },
  //   getArrowCoords: (options: GetCoordsOptions) => {
  //     return {}
  //   },
  //   flipCoords: () => {},
  // },
  // leftTop: {
  //   getTooltipCoords: (options: GetCoordsOptions) => {
  //     const { trigger, tooltip, positioned, arrow } = options

  //     const _positioned = positioned.getBoundingClientRect()

  //     const _trigger = trigger.getBoundingClientRect()

  //     const _arrowWidth = arrow ? arrow.clientWidth : 4

  //     return {
  //       top: _trigger.top - _positioned.top,
  //       left: _trigger.left - tooltip.clientWidth - _arrowWidth - _positioned.left,
  //     }
  //   },
  //   getArrowCoords: (options: GetCoordsOptions) => {
  //     return {}
  //   },
  //   flipCoords: () => {},
  // },
  // left: {
  //   getTooltipCoords: (options: GetCoordsOptions) => {
  //     const { trigger, tooltip, positioned, arrow } = options

  //     const _positioned = positioned.getBoundingClientRect()

  //     const _trigger = trigger.getBoundingClientRect()

  //     const _arrowWidth = arrow ? arrow.clientWidth : 4

  //     return {
  //       top: _trigger.top + (_trigger.height - tooltip.clientHeight) / 2 - _positioned.top,
  //       left: _trigger.left - tooltip.clientWidth - _arrowWidth - _positioned.left,
  //     }
  //   },
  //   getArrowCoords: (options: GetCoordsOptions) => {
  //     const { tooltip, trigger, arrow } = options

  //     return {}
  //   },
  //   flipCoords: () => {},
  // },
  // leftBottom: {
  //   getTooltipCoords: (options: GetCoordsOptions) => {
  //     const { trigger, tooltip, positioned, arrow } = options

  //     const _positioned = positioned.getBoundingClientRect()

  //     const _trigger = trigger.getBoundingClientRect()

  //     const _arrowWidth = arrow ? arrow.clientWidth : 4

  //     return {
  //       top: _trigger.bottom - tooltip.clientHeight - _positioned.top,
  //       left: _trigger.left - tooltip.clientWidth - _arrowWidth - _positioned.left,
  //     }
  //   },
  //   getArrowCoords: (options: GetCoordsOptions) => {
  //     return {}
  //   },
  //   flipCoords: () => {},
  // },
}

class TopLeftPlacement {
  getPopupCoords = (options: GetCoordsOptions) => {
    const { popup, trigger, relative } = options

    // 相对于屏幕的坐标
    const screenCoords = {
      top: trigger.coords.top - popup.height,
      left: trigger.coords.left,
    }

    // 相对于定位元素
    return {
      top: screenCoords.top - relative.coords.top,
      left: screenCoords.left - relative.coords.left,
    }
  }
}
