import type { TooltipPlacement, TooltipProps } from '../props'
import { getRelativeElement } from './element'

export interface AlignOptions {
  props: TooltipProps
  popup: HTMLElement
  trigger: HTMLElement
}

export function makeAlignHelper(placement: TooltipPlacement, config: any) {
  return (options: AlignOptions) => {
    {
      const { popup, trigger, props } = options

      // 相对于哪个元素定位
      const relative = getRelativeElement(popup)

      // trigger元素位置
      const triggerCoords = 
      const screenCoords = getScreenCoords(options)
    }

    // 依次获得各个元素的位置信息
    // 计算出 popup 相对于 screen 的偏移位置
    // 计算出 popup 相对于 relative 的偏移位置
    // 计算出 arrow 相对于 screen 的偏移位置
    // 计算出 popup 相对于 popup 的偏移位置

    // ... flip 等功能
  }
}

const defaultArrowSize = {
  size: 16,
  offsetX: 12,
  offsetY: 12,
}

export default {
  topLeft: makeAlignHelper('topLeft', () => {}),
  top: makeAlignHelper('top', () => {}),
  topRight: makeAlignHelper('topRight', () => {}),
}
