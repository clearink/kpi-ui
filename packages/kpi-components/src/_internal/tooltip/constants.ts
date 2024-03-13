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

      const _positioned = positioned.getBoundingClientRect()

      const _trigger = trigger.getBoundingClientRect()

      const _arrowHeight = arrow ? arrow.clientHeight : 4

      console.log('_arrowHeight', _arrowHeight)
      return {
        top: _trigger.top - tooltip.clientHeight - _arrowHeight - _positioned.top,
        left: _trigger.left - _positioned.left,
        '--origin-x': `${12 + (arrow?.clientWidth || 0) / 2}px`,
        '--origin-y': `${tooltip.clientHeight + _arrowHeight / 2}px`,
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

      const _positioned = positioned.getBoundingClientRect()

      const _trigger = trigger.getBoundingClientRect()

      const _arrowHeight = arrow ? arrow.clientHeight : 4

      return {
        top: _trigger.top - tooltip.clientHeight - _arrowHeight - _positioned.top,
        left: _trigger.left + (_trigger.width - tooltip.scrollWidth) / 2 - _positioned.left,
        '--origin-x': `${tooltip.clientWidth / 2}px`,
        '--origin-y': `${tooltip.clientHeight + _arrowHeight / 2}px`,
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

      const _positioned = positioned.getBoundingClientRect()

      const _trigger = trigger.getBoundingClientRect()

      const _arrowHeight = arrow ? arrow.clientHeight : 4

      return {
        top: _trigger.top - tooltip.clientHeight - _arrowHeight - _positioned.top,
        left: _trigger.right - tooltip.scrollWidth - _positioned.left,
        '--origin-x': `${tooltip.clientWidth - 12 - (arrow?.clientWidth || 0) / 2}px`,
        '--origin-y': `${tooltip.clientHeight + _arrowHeight / 2}px`,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  rightTop: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { trigger, positioned, arrow } = options

      const _positioned = positioned.getBoundingClientRect()

      const _trigger = trigger.getBoundingClientRect()

      const _arrowWidth = arrow ? arrow.clientWidth : 4

      return {
        top: _trigger.top - _positioned.top,
        left: _trigger.right + _arrowWidth - _positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  right: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { trigger, tooltip, positioned, arrow } = options

      const _positioned = positioned.getBoundingClientRect()

      const _trigger = trigger.getBoundingClientRect()

      const _arrowWidth = arrow ? arrow.clientWidth : 4

      return {
        top: _trigger.top + (_trigger.height - tooltip.clientHeight) / 2 - _positioned.top,
        left: _trigger.right + _arrowWidth - _positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  rightBottom: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { trigger, tooltip, positioned, arrow } = options

      const _positioned = positioned.getBoundingClientRect()

      const _trigger = trigger.getBoundingClientRect()

      const _arrowWidth = arrow ? arrow.clientWidth : 4

      return {
        top: _trigger.bottom - tooltip.clientHeight - _positioned.top,
        left: _trigger.right + _arrowWidth - _positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  bottomLeft: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { trigger, positioned, arrow } = options

      const _positioned = positioned.getBoundingClientRect()

      const _trigger = trigger.getBoundingClientRect()

      const _arrowHeight = arrow ? arrow.clientHeight : 4

      return {
        top: _trigger.bottom + _arrowHeight - _positioned.top,
        left: _trigger.left - _positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  bottom: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { trigger, tooltip, positioned, arrow } = options

      const _positioned = positioned.getBoundingClientRect()

      const _trigger = trigger.getBoundingClientRect()

      const _arrowHeight = arrow ? arrow.clientHeight : 4

      return {
        top: _trigger.bottom + _arrowHeight - _positioned.top,
        left: _trigger.left + (_trigger.width - tooltip.clientWidth) / 2 - _positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  bottomRight: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { trigger, tooltip, positioned, arrow } = options

      const _positioned = positioned.getBoundingClientRect()

      const _trigger = trigger.getBoundingClientRect()

      const _arrowHeight = arrow ? arrow.clientHeight : 4

      return {
        top: _trigger.bottom + _arrowHeight - _positioned.top,
        left: _trigger.right - tooltip.clientWidth - _positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  leftTop: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { trigger, tooltip, positioned, arrow } = options

      const _positioned = positioned.getBoundingClientRect()

      const _trigger = trigger.getBoundingClientRect()

      const _arrowWidth = arrow ? arrow.clientWidth : 4

      return {
        top: _trigger.top - _positioned.top,
        left: _trigger.left - tooltip.clientWidth - _arrowWidth - _positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  left: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { trigger, tooltip, positioned, arrow } = options

      const _positioned = positioned.getBoundingClientRect()

      const _trigger = trigger.getBoundingClientRect()

      const _arrowWidth = arrow ? arrow.clientWidth : 4

      return {
        top: _trigger.top + (_trigger.height - tooltip.clientHeight) / 2 - _positioned.top,
        left: _trigger.left - tooltip.clientWidth - _arrowWidth - _positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return {}
    },
    flipCoords: () => {},
  },
  leftBottom: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { trigger, tooltip, positioned, arrow } = options

      const _positioned = positioned.getBoundingClientRect()

      const _trigger = trigger.getBoundingClientRect()

      const _arrowWidth = arrow ? arrow.clientWidth : 4

      return {
        top: _trigger.bottom - tooltip.clientHeight - _positioned.top,
        left: _trigger.left - tooltip.clientWidth - _arrowWidth - _positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
}
