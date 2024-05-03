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

  autoLayout?: boolean | { horizontal?: boolean; vertical?: boolean }

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
  top: number
  left: number
  _width: number
  _height: number
}

export type ArrowCoords = Pick<ScreenCoords, 'top' | 'left'>

export type OriginCoords = Pick<ScreenCoords, 'top' | 'left'>

export interface ShiftPopupCoordsOptions {
  adjustedCoords: ScreenCoords
  triggerCoords: ElementCoords
  popupCoords: ElementCoords
}

export interface GetArrowCoordsOptions {
  adjustedCoords: ScreenCoords
  triggerCoords: ElementCoords
  contentCoords: ElementCoords
}
export type FlipPopupCoordsOptions = ShiftPopupCoordsOptions

export interface AlignerConfig {
  // 相对于 viewport 的坐标
  getScreenCoords: (trigger: ElementCoords, popup: ElementCoords) => ScreenCoords

  // 调整
  shiftPopupCoords: (options: ShiftPopupCoordsOptions) => ScreenCoords

  // 翻转
  flipPopupCoords: (options: FlipPopupCoordsOptions) => ScreenCoords

  // 箭头位置
  getArrowCoords: (options: GetArrowCoordsOptions) => ArrowCoords

  // 转换原点
  getOriginCoords: (arrow: ArrowCoords) => OriginCoords
}
