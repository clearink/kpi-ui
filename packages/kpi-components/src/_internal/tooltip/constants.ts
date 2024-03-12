interface GetCoordsOptions {
  tooltip: DOMRect
  trigger: DOMRect
  arrow: DOMRect
}
export const TOOLTIP_PLACEMENT = {
  topLeft: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return {
        top: Math.floor(trigger.top - tooltip.height - arrow.height),
        left: Math.floor(trigger.left),
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return { left: arrow.width / 2 }
    },
    flipCoords: () => {},
  },
  top: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return {
        top: Math.floor(trigger.top - tooltip.height - arrow.height),
        left: Math.floor(trigger.left + (trigger.width - tooltip.width) / 2),
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  topRight: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return {
        top: Math.floor(trigger.top - tooltip.height - arrow.height),
        left: Math.floor(trigger.left + trigger.width - tooltip.width),
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
      const { trigger, arrow } = options

      return {
        top: Math.floor(trigger.top),
        left: Math.floor(trigger.left + trigger.width + arrow.width),
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
      const { tooltip, trigger, arrow } = options

      return {
        top: Math.floor(trigger.top + (trigger.height - tooltip.height) / 2),
        left: Math.floor(trigger.left + trigger.width + arrow.width),
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  rightBottom: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return {
        top: Math.floor(trigger.top + trigger.height - tooltip.height),
        left: Math.floor(trigger.left + trigger.width + arrow.width),
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
      const { trigger, arrow } = options

      return {
        top: Math.floor(trigger.top + trigger.height + arrow.height),
        left: Math.floor(trigger.left),
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
      const { tooltip, trigger, arrow } = options

      return {
        top: Math.floor(trigger.top + trigger.height + arrow.height),
        left: Math.floor(trigger.left + (trigger.width - tooltip.width) / 2),
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      return {}
    },
    flipCoords: () => {},
  },
  bottomRight: {
    getTooltipCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return {
        top: Math.floor(trigger.top + trigger.height + arrow.height),
        left: Math.floor(trigger.left + trigger.width - tooltip.width),
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
      const { tooltip, trigger, arrow } = options

      return {
        top: Math.floor(trigger.top),
        left: Math.floor(trigger.left - tooltip.width - arrow.width),
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
      const { tooltip, trigger, arrow } = options

      return {
        top: Math.floor(trigger.top + (trigger.height - tooltip.height) / 2),
        left: Math.floor(trigger.left - tooltip.width - arrow.width),
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
      const { tooltip, trigger, arrow } = options

      return {
        top: Math.floor(trigger.top + trigger.height - tooltip.height),
        left: Math.floor(trigger.left - tooltip.width - arrow.width),
      }
    },
    getArrowCoords: (options: GetCoordsOptions) => {
      const { tooltip, trigger, arrow } = options

      return { bottom: arrow.width / 2 }
    },
    flipCoords: () => {},
  },
}
