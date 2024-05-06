import { getElementCoords } from './utils/elements'
// types
import type { HasChildren, SemanticStyledProps } from '@kpi-ui/types'
import type { OverlayProps } from '../_internal/overlay/props'

export type ToolTipTrigger = 'hover' | 'focus' | 'click' | 'contextMenu'

export type TooltipPlacement =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'rightTop'
  | 'right'
  | 'rightBottom'
  | 'bottomRight'
  | 'bottom'
  | 'bottomLeft'
  | 'leftBottom'
  | 'left'
  | 'leftTop'

export interface TooltipProps
  extends Required<HasChildren<React.ReactElement>>,
    SemanticStyledProps<'root' | 'main' | 'arrow' | 'content'>,
    Pick<OverlayProps, 'zIndex' | 'getContainer' | 'keepMounted' | 'unmountOnExit'> {
  transition?: string

  content?: React.ReactNode

  trigger?: ToolTipTrigger | ToolTipTrigger[]

  fresh?: boolean

  open?: boolean

  defaultOpen?: boolean

  onOpenChange?: (open: boolean) => void

  openDelay?: number

  closeDelay?: number

  placement?: TooltipPlacement

  arrow?: boolean | { pointAtCenter: boolean }

  shift?: boolean

  flip?: boolean

  offset?: number | [number, number]
}

export interface Coords {
  top?: number | string
  left?: number | string
  '--origin-x'?: string
  '--origin-y'?: string
}

export interface AlignerOptions {
  props: TooltipProps
  popup: HTMLElement
  trigger: HTMLElement
  content: HTMLElement
}

export type ElementCoords = ReturnType<typeof getElementCoords>

export interface ScreenCoords {
  /** 垂直方向偏移量 */
  top: number
  /** 水平方向偏移量 */
  left: number
  // /** 真实宽度 */
  _width: number
  /** 真实高度 */
  _height: number
  /** 主轴 */
  main: 'top' | 'bottom' | 'left' | 'right'
  /** 交叉轴 */
  cross: 'left' | 'center' | 'right' | 'top' | 'bottom'
}

export type ArrowCoords = Pick<ScreenCoords, 'top' | 'left'>

export type OriginCoords = Pick<ScreenCoords, 'top' | 'left'>

export interface GetScreenCoordsOptions {
  triggerCoords: ElementCoords
  popupCoords: ElementCoords
}

export interface KeepArrowCenterOptions {
  adjustedCoords: ScreenCoords
  triggerCoords: ElementCoords
}

export interface ShiftPopupCoordsOptions {
  adjustedCoords: ScreenCoords
  triggerCoords: ElementCoords
}

export type FlipPopupCoordsOptions = ShiftPopupCoordsOptions

export interface GetArrowCoordsOptions {
  adjustedCoords: ScreenCoords
  triggerCoords: ElementCoords
  contentCoords: ElementCoords
}

export interface AlignerConfig {
  // 相对于 viewport 的坐标
  getScreenCoords: (options: GetScreenCoordsOptions) => ScreenCoords

  keepArrowCenter: (options: KeepArrowCenterOptions) => ScreenCoords

  // 调整
  shiftPopupCoords: (options: ShiftPopupCoordsOptions) => ScreenCoords

  // 翻转
  flipPopupCoords: (options: FlipPopupCoordsOptions) => ScreenCoords

  // 箭头位置
  getArrowCoords: (options: GetArrowCoordsOptions) => ArrowCoords

  // 转换原点
  getOriginCoords: (arrowCoords: ArrowCoords, adjustedCoords: ScreenCoords) => OriginCoords
}
