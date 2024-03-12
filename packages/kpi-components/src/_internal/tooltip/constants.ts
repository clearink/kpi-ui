interface GetCoordsOptions {
  positioned: DOMRect
  tooltip: DOMRect
  trigger: DOMRect
  arrow: DOMRect
}
export const TOOLTIP_PLACEMENT = {
  topLeft: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow, positioned } = options

      return {
        top: trigger.top - tooltip.height - arrow.height - positioned.top,
        left: trigger.left - positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      const { arrow } = options

      return { left: arrow.width / 2 }
    },
    flipCoords: () => {},
  },
  top: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow, positioned } = options

      return {
        top: trigger.top - tooltip.height - arrow.height - positioned.top,
        left: trigger.left + (trigger.width - tooltip.width) / 2 - positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  topRight: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow, positioned } = options

      return {
        top: trigger.top - tooltip.height - arrow.height - positioned.top,
        left: trigger.left + trigger.width - tooltip.width - positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return { right: arrow.width / 2 }
    },
    flipCoords: () => {},
  },
  rightTop: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { trigger, arrow, positioned } = options

      return {
        top: trigger.top - positioned.top,
        left: trigger.left + trigger.width + arrow.width - positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return { top: arrow.width / 2 }
    },
    flipCoords: () => {},
  },
  right: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow, positioned } = options

      return {
        top: trigger.top + (trigger.height - tooltip.height) / 2 - positioned.top,
        left: trigger.left + trigger.width + arrow.width - positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  rightBottom: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow, positioned } = options

      return {
        top: trigger.top + trigger.height - tooltip.height - positioned.top,
        left: trigger.left + trigger.width + arrow.width - positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return { bottom: arrow.width / 2 }
    },
    flipCoords: () => {},
  },
  bottomLeft: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { trigger, arrow, positioned } = options

      return {
        top: trigger.top + trigger.height + arrow.height - positioned.top,
        left: trigger.left - positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return { left: arrow.width / 2 }
    },
    flipCoords: () => {},
  },
  bottom: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow, positioned } = options

      return {
        top: trigger.top + trigger.height + arrow.height - positioned.top,
        left: trigger.left + (trigger.width - tooltip.width) / 2 - positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  bottomRight: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow, positioned } = options

      return {
        top: trigger.top + trigger.height + arrow.height - positioned.top,
        left: trigger.left + trigger.width - tooltip.width - positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return { right: arrow.width / 2 }
    },
    flipCoords: () => {},
  },
  leftTop: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow, positioned } = options

      return {
        top: trigger.top - positioned.top,
        left: trigger.left - tooltip.width - arrow.width - positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return { top: arrow.width / 2 }
    },
    flipCoords: () => {},
  },
  left: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow, positioned } = options

      return {
        top: trigger.top + (trigger.height - tooltip.height) / 2 - positioned.top,
        left: trigger.left - tooltip.width - arrow.width - positioned.left,
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
      const { tooltip, trigger, arrow, positioned } = options

      return {
        top: trigger.top + trigger.height - tooltip.height - positioned.top,
        left: trigger.left - tooltip.width - arrow.width - positioned.left,
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return { bottom: arrow.width / 2 }
    },
    flipCoords: () => {},
  },
}
