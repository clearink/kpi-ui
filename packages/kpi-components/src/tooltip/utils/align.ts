import { TooltipPlacement } from '../props'

export function makeAlignment(
  placement: TooltipPlacement,
  defaultArrow: { size: number; offsetX: number; offsetY: number }
) {
  type TOptions = any
  return (options: TOptions) => {
    const { popup, trigger, relative, arrow } = options

    // 依次获得各个元素的位置信息

    // 计算出 popup 相对于 screen 的偏移位置

    // 计算出 popup 相对于 relative 的偏移位置

    // 计算出 arrow 相对于 screen 的偏移位置

    // 计算出 popup 相对于 popup 的偏移位置

    // ... flip 等功能
  }
}

export const topLeftAlignment = makeAlignment('topLeft', { size: 16, offsetX: 12, offsetY: 8 })

export const topAlignment = makeAlignment('top', { size: 16, offsetX: 12, offsetY: 8 })

export const topRightAlignment = makeAlignment('topRight', { size: 16, offsetX: 12, offsetY: 8 })
