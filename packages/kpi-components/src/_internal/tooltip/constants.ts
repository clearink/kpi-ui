export const TOOLTIP_PLACEMENT = {
  topLeft: {
    getCoords: (tooltip: DOMRect, trigger: DOMRect) => ({
      top: trigger.top - tooltip.height,
      left: trigger.left,
    }),
    flipCoords: () => {},
  },
  top: {
    getCoords: (tooltip: DOMRect, trigger: DOMRect) => ({
      top: trigger.top - tooltip.height,
      left: trigger.left + (trigger.width - tooltip.width) / 2,
    }),
    flipCoords: () => {},
  },
  topRight: {
    getCoords: (tooltip: DOMRect, trigger: DOMRect) => ({
      top: trigger.top - tooltip.height,
      left: trigger.left + trigger.width - tooltip.width,
    }),
    flipCoords: () => {},
  },
  rightTop: {
    getCoords: (tooltip: DOMRect, trigger: DOMRect) => ({
      top: trigger.top,
      left: trigger.left + trigger.width,
    }),
    flipCoords: () => {},
  },
  right: {
    getCoords: (tooltip: DOMRect, trigger: DOMRect) => ({
      top: trigger.top + (trigger.height - tooltip.height) / 2,
      left: trigger.left + trigger.width,
    }),
    flipCoords: () => {},
  },
  rightBottom: {
    getCoords: (tooltip: DOMRect, trigger: DOMRect) => ({
      top: trigger.top + trigger.height - tooltip.height,
      left: trigger.left + trigger.width,
    }),
    flipCoords: () => {},
  },
  bottomLeft: {
    getCoords: (tooltip: DOMRect, trigger: DOMRect) => ({
      top: trigger.top + trigger.height,
      left: trigger.left,
    }),
    flipCoords: () => {},
  },
  bottom: {
    getCoords: (tooltip: DOMRect, trigger: DOMRect) => ({
      top: trigger.top + trigger.height,
      left: trigger.left + (trigger.width - tooltip.width) / 2,
    }),
    flipCoords: () => {},
  },
  bottomRight: {
    getCoords: (tooltip: DOMRect, trigger: DOMRect) => ({
      top: trigger.top + trigger.height,
      left: trigger.left + trigger.width - tooltip.width,
    }),
    flipCoords: () => {},
  },
  leftTop: {
    getCoords: (tooltip: DOMRect, trigger: DOMRect) => ({
      top: trigger.top,
      left: trigger.left - tooltip.width,
    }),
    flipCoords: () => {},
  },
  left: {
    getCoords: (tooltip: DOMRect, trigger: DOMRect) => ({
      top: trigger.top + (trigger.height - tooltip.height) / 2,
      left: trigger.left - tooltip.width,
    }),
    flipCoords: () => {},
  },
  leftBottom: {
    getCoords: (tooltip: DOMRect, trigger: DOMRect) => ({
      top: trigger.top + trigger.height - tooltip.height,
      left: trigger.left - tooltip.width,
    }),
    flipCoords: () => {},
  },
}
