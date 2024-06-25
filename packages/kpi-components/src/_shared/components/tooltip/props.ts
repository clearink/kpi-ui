import { getElementCoords } from './utils/elements'
// types
import type { HasChildren, SemanticStyledProps } from '@kpi-ui/types'
import type { OverlayProps } from '../overlay/props'

export type TriggerEvent = 'hover' | 'focus' | 'click' | 'contextMenu'

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

export interface InternalTooltipProps
  extends Required<HasChildren<React.ReactElement>>,
    SemanticStyledProps<'root' | 'arrow'>,
    Pick<OverlayProps, 'zIndex' | 'getContainer' | 'keepMounted' | 'unmountOnExit'> {
  transition?: string

  content?: React.ReactNode

  trigger?: TriggerEvent | TriggerEvent[]

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

export interface PopupCoords {
  top: string | number
  left: string | number
  '--origin-y': string
  '--origin-x': string
}

export interface ArrowCoords {
  top: number
  left: number
  transform: string
}

export type ElementCoords = ReturnType<typeof getElementCoords>

export type HorizontalMainAxis = 'left' | 'right'
export type VerticalMainAxis = 'top' | 'bottom'
export type MainAxis = HorizontalMainAxis | VerticalMainAxis

export type HorizontalCrossAxis = 'top' | 'center' | 'bottom'
export type VerticalCrossAxis = 'left' | 'center' | 'right'
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

export type OriginCoords = Pick<ScreenCoords, 'top' | 'left'>

export interface AlignerConfig {
  // 相对于 viewport 的坐标
  getScreenCoords: (
    props: InternalTooltipProps,
    popup: ElementCoords,
    trigger: ElementCoords
  ) => ScreenCoords

  keepArrowCenter: (
    props: InternalTooltipProps,
    screen: ScreenCoords,
    trigger: ElementCoords
  ) => ScreenCoords

  // 调整
  shiftPopupCoords: (
    props: InternalTooltipProps,
    screen: ScreenCoords,
    trigger: ElementCoords
  ) => ScreenCoords

  // 翻转
  flipPopupCoords: (
    props: InternalTooltipProps,
    screen: ScreenCoords,
    trigger: ElementCoords
  ) => ScreenCoords

  // 箭头位置
  getArrowCoords: (screen: ScreenCoords, trigger: ElementCoords) => ArrowCoords

  // 转换原点
  getOriginCoords: (arrow: ArrowCoords, screen: ScreenCoords) => OriginCoords
}
