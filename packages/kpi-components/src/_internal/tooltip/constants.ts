import { getArrowCoords, getElementCoords } from './utils/coords'

interface GetCoordsOptions {
  positioned: Element
  tooltip: Element
  trigger: Element
  arrow: Element | null
}

// TODO: 去除魔术字符串

export const TOOLTIP_PLACEMENT = {
  topLeft: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, positioned, arrow } = options

      const _positioned = getElementCoords(positioned)

      const _trigger = getElementCoords(trigger)

      const _tooltip = getElementCoords(tooltip)

      const _arrow = getArrowCoords(arrow, _tooltip)

      return {
        top: _trigger.top - _tooltip.clientHeight - _arrow.clientHeight - _positioned.top,
        left: _trigger.left - _positioned.left,
        '--origin-x': `${_arrow.left - _tooltip.left}px`,
        '--origin-y': `${_arrow.top - _tooltip.top}px`,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  top: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, positioned, arrow } = options

      const _positioned = getElementCoords(positioned)

      const _trigger = getElementCoords(trigger)

      const _tooltip = getElementCoords(tooltip)

      const _arrow = getArrowCoords(arrow, _tooltip)

      return {
        top: _trigger.top - tooltip.clientHeight - _arrow.height - _positioned.top,
        left: _trigger.left + (_trigger.width - tooltip.scrollWidth) / 2 - _positioned.left,
        '--origin-x': `${tooltip.clientWidth / 2}px`,
        '--origin-y': `${tooltip.clientHeight + _arrow.height / 2}px`,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  topRight: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, positioned, arrow } = options

      const _positioned = getElementCoords(positioned)

      const _trigger = getElementCoords(trigger)

      const _tooltip = getElementCoords(tooltip)

      const _arrow = getArrowCoords(arrow, _tooltip)

      return {
        top: _trigger.top - tooltip.clientHeight - _arrow.height - _positioned.top,
        left:
          _trigger.left +
          _trigger.width -
          _tooltip.clientWidth -
          _arrow.clientWidth -
          _positioned.left,
        '--origin-x': `${tooltip.clientWidth / 2}px`,
        '--origin-y': `${tooltip.clientHeight + _arrow.height / 2}px`,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
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
