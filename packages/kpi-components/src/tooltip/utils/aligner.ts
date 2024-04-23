import { ownerDocument, ownerWindow } from '@kpi-ui/utils'
import { getElementCoords, getPositionedCoords } from './element'
// types
import type { TooltipPlacement, TooltipProps } from '../props'

export interface AlignOptions {
  props: TooltipProps
  popup: HTMLElement
  trigger: HTMLElement
  onFlip: () => void
}

export interface AlignResult {
  screenCoords: {
    top: number
    left: number
  }
  adjustedCoords: {
    top: number
    left: number
  }
  offsetCoords: {
    top: number
    left: number
  }
}

export interface AlignerConfig {
  // 相对于屏幕的坐标信息
  getCoords: (
    trigger: ReturnType<typeof getElementCoords>,
    popup: ReturnType<typeof getElementCoords>
  ) => AlignResult

  // // 箭头坐标信息
  // getOffsetCoords: (
  //   popup: ReturnType<typeof getElementCoords>,
  //   screen: AlignResult['screenCoords']
  // ) => {
  //   '--origin-x': string
  //   '--origin-y': string
  // }

  // 尝试调整坐标
  attemptAdjustPopupCoords?: (
    screen: AlignResult['screenCoords'],
    trigger: ReturnType<typeof getElementCoords>,
    positioned: ReturnType<typeof getElementCoords>
  ) => AlignResult
}
/**
 * @description 对齐逻辑
 * @param placement 对齐方向
 * @param config 配置? 要传什么进去呢?
 * @returns 函数 具体参数为 popup(浮层元素) trigger(触发元素) props (TooltipProps)
 */
function aligner(config: AlignerConfig) {
  const { getCoords } = config

  return (options: AlignOptions) => {
    const { popup, trigger, props } = options

    // 依次获得各个元素的位置信息
    const triggerCoords = getElementCoords(trigger)
    const popupCoords = getElementCoords(popup)
    const positionedCoords = getPositionedCoords(popup)

    const { adjustedCoords, offsetCoords } = getCoords(triggerCoords, popupCoords)

    return {
      top: adjustedCoords.top - positionedCoords.top,
      left: adjustedCoords.left - positionedCoords.left,
      '--origin-y': `${offsetCoords.top}px`,
      '--origin-x': `${offsetCoords.left}px`,
    }
  }
}

const aligners = {
  // topLeft: aligner({
  //   getCoords: (trigger, popup) => {
  //     const screenCoords = {
  //       top: trigger.top - popup._height,
  //       left: trigger.left,
  //     }
  //     return { screenCoords }
  //   },
  //   getOffsetCoords: (popup) => {
  //     const size = 8
  //     return {
  //       '--origin-x': `${size * 2}px`,
  //       '--origin-y': `${popup._height - size}px`,
  //     }
  //   },
  // }),
  // top: aligner({
  //   getCoords: (trigger, popup) => {
  //     const screenCoords = {
  //       top: trigger.top - popup._height,
  //       left: trigger.left + (trigger.width - popup._width) / 2,
  //     }
  //     return { screenCoords }
  //   },
  //   getOffsetCoords: (popup, screen) => {
  //     const size = 8
  //     return {
  //       '--origin-x': `${popup._width / 2}px`,
  //       '--origin-y': `${popup._height - size}px`,
  //     }
  //   },
  // }),
  topRight: aligner({
    getCoords: (trigger, popup) => {
      const screenCoords = {
        top: trigger.top - popup._height,
        left: trigger.left + (trigger.width - popup._width),
      }

      const adjustedCoords = { ...screenCoords }

      const root = ownerDocument(trigger.el)
      const rootWidth = (root.documentElement || root.body).clientWidth

      // 无法继续调整=>trigger的位置需要判断了

      const size = 8
      const ratio = 2

      // 应当以 triggerCoords 为基准来计算

      if (screenCoords.left + popup._width >= rootWidth) {
        adjustedCoords.left = rootWidth - popup._width

        // adjustedCoords.left 相距太大 则 不应该执行上一句的逻辑
        if (trigger.left - adjustedCoords.left >= popup._width - size * 4) {
          // 保持当前
          adjustedCoords.left = Math.min(screenCoords.left, trigger.left - popup._width + size * 4)
        }
      }

      const offsetCoords = {
        top: popup._height - size,
        left: popup._width - size * ratio,
      }

      return { screenCoords, adjustedCoords, offsetCoords }
    },

    // getOffsetCoords: (popup, screen) => {
    //   const size = 8
    //   const ratio = 2

    //   return {
    //     '--origin-x': `${popup._width - size * ratio}px`,
    //     '--origin-y': `${popup._height - size}px`,
    //   }
    // },

    // 翻转
    // flipCoords:()=>{}
  }),
  // rightTop: aligner({
  //   getCoords: (trigger) => {
  //     const screenCoords = {
  //       top: trigger.top,
  //       left: trigger.right,
  //     }
  //     return { screenCoords }
  //   },
  //   getOffsetCoords: (popup) => {
  //     const size = 8
  //     const ratio = 1.5
  //     return {
  //       '--origin-x': `${size}px`,
  //       '--origin-y': `${size * ratio}px`,
  //     }
  //   },
  // }),
  // right: aligner({
  //   getCoords: (trigger, popup) => {
  //     const screenCoords = {
  //       top: trigger.top + (trigger.height - popup._height) / 2,
  //       left: trigger.right,
  //     }
  //     return { screenCoords }
  //   },
  //   getOffsetCoords: (popup) => {
  //     const size = 8
  //     return {
  //       '--origin-x': `${size}px`,
  //       '--origin-y': `${popup._height / 2}px`,
  //     }
  //   },
  // }),
  // rightBottom: aligner({
  //   getCoords: (trigger, popup) => {
  //     const screenCoords = {
  //       top: trigger.bottom - popup._height,
  //       left: trigger.right,
  //     }
  //     return { screenCoords }
  //   },
  //   getOffsetCoords: (popup) => {
  //     const size = 8
  //     const ratio = 1.5
  //     return {
  //       '--origin-x': `${size}px`,
  //       '--origin-y': `${popup._height - size * ratio}px`,
  //     }
  //   },
  // }),
  // bottomRight: aligner({
  //   getCoords: (trigger, popup) => {
  //     const screenCoords = {
  //       top: trigger.bottom,
  //       left: trigger.right - popup._width,
  //     }
  //     return { screenCoords }
  //   },
  //   getOffsetCoords: (popup) => {
  //     const size = 8
  //     const ratio = 2
  //     return {
  //       '--origin-x': `${popup._width - size * ratio}px`,
  //       '--origin-y': `${size}px`,
  //     }
  //   },
  // }),
  // bottom: aligner({
  //   getCoords: (trigger, popup) => {
  //     const screenCoords = {
  //       top: trigger.bottom,
  //       left: trigger.left + (trigger.width - popup._width) / 2,
  //     }
  //     return { screenCoords }
  //   },
  //   getOffsetCoords: (popup) => {
  //     const size = 8
  //     return {
  //       '--origin-x': `${popup._width / 2}px`,
  //       '--origin-y': `${size}px`,
  //     }
  //   },
  // }),
  // bottomLeft: aligner({
  //   getCoords: (trigger) => {
  //     const screenCoords = {
  //       top: trigger.bottom,
  //       left: trigger.left,
  //     }
  //     return { screenCoords }
  //   },
  //   getOffsetCoords: (popup) => {
  //     const size = 8
  //     const ratio = 2
  //     return {
  //       '--origin-x': `${size * ratio}px`,
  //       '--origin-y': `${size}px`,
  //     }
  //   },
  // }),
  // leftBottom: aligner({
  //   getCoords: (trigger, popup) => {
  //     const screenCoords = {
  //       top: trigger.bottom - popup._height,
  //       left: trigger.left - popup._width,
  //     }
  //     return { screenCoords }
  //   },
  //   getOffsetCoords: (popup) => {
  //     const size = 8
  //     const ratio = 1.5
  //     return {
  //       '--origin-x': `${popup._width - size}px`,
  //       '--origin-y': `${popup._height - size * ratio}px`,
  //     }
  //   },
  // }),
  // left: aligner({
  //   getCoords: (trigger, popup) => {
  //     const screenCoords = {
  //       top: trigger.top + (trigger.height - popup._height) / 2,
  //       left: trigger.left - popup._width,
  //     }
  //     return { screenCoords }
  //   },
  //   getOffsetCoords: (popup) => {
  //     const size = 8
  //     return {
  //       '--origin-x': `${popup._width - size}px`,
  //       '--origin-y': `${popup._height / 2}px`,
  //     }
  //   },
  // }),
  // leftTop: aligner({
  //   getCoords: (trigger, popup) => {
  //     const screenCoords = {
  //       top: trigger.top,
  //       left: trigger.left - popup._width,
  //     }
  //     return { screenCoords }
  //   },
  //   getOffsetCoords: (popup) => {
  //     const size = 8
  //     const ratio = 1.5
  //     return {
  //       '--origin-x': `${popup._width - size}px`,
  //       '--origin-y': `${size * ratio}px`,
  //     }
  //   },
  // }),
} as Record<TooltipPlacement, ReturnType<typeof aligner>>

export default aligners
