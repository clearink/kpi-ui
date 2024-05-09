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

  shift?: boolean | { horizontal?: boolean; vertical?: boolean }

  flip?: boolean | { horizontal?: boolean; vertical?: boolean }

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

export type HorizontalMainAxis = 'top' | 'bottom'
export type VerticalMainAxis = 'left' | 'right'
export type MainAxis = HorizontalMainAxis | VerticalMainAxis

export type HorizontalCrossAxis = 'left' | 'center' | 'right'
export type VerticalCrossAxis = 'top' | 'center' | 'bottom'
export type CrossAxis = HorizontalCrossAxis | VerticalCrossAxis

export interface ScreenCoords {
  /** 垂直方向偏移量 */
  top: number
  /** 水平方向偏移量 */
  left: number
  // /** 真实宽度 */
  _width: number
  /** 真实高度 */
  _height: number
  /** 屏幕宽度 */
  _mx: number
  /** 屏幕高度 */
  _my: number
  /** keep arrow center 时调整的距离 */
  _delta: number
  /** 主轴 */
  main: MainAxis
  /** 交叉轴 */
  cross: CrossAxis
}

// export interface ArrowCoords {
//   top?: number | string
//   left?: number | string
//   bottom?: number | string
//   right?: number | string
// }

export type ArrowCoords = Pick<ScreenCoords, 'top' | 'left'>

export type OriginCoords = Pick<ScreenCoords, 'top' | 'left'>

export interface GetScreenCoordsOptions {
  triggerCoords: ElementCoords
  popupCoords: ElementCoords
}

export interface KeepArrowCenterOptions {
  props: TooltipProps
  adjustedCoords: ScreenCoords
  triggerCoords: ElementCoords
}

export interface ShiftPopupCoordsOptions {
  props: TooltipProps
  adjustedCoords: ScreenCoords
  triggerCoords: ElementCoords
}

export interface FlipPopupCoordsOptions {
  props: TooltipProps
  adjustedCoords: ScreenCoords
  triggerCoords: ElementCoords
}

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
