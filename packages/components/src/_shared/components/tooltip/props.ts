import type { HasChildren, PopupPlacement, SemanticStyledProps } from '@comps/_shared/types'

import type { OverlayProps } from '../overlay/props'
import type { getElementCoords } from './utils/elements'

export type TriggerEvent = 'click' | 'contextMenu' | 'focus' | 'hover'

export interface InternalTooltipProps
  extends Required<HasChildren<React.ReactElement>>,
  SemanticStyledProps<'arrow' | 'root'>,
  Pick<OverlayProps, 'getContainer' | 'keepMounted' | 'unmountOnExit' | 'zIndex'> {
  arrow?: { pointAtCenter: boolean } | boolean

  closeDelay?: number

  content?: React.ReactNode

  defaultOpen?: boolean

  flip?: { horizontal?: boolean, vertical?: boolean } | boolean

  fresh?: boolean

  offset?: [number, number] | number

  onOpenChange?: (open: boolean) => void

  open?: boolean

  openDelay?: number

  placement?: PopupPlacement

  shift?: { horizontal?: boolean, vertical?: boolean } | boolean

  transition?: string

  trigger?: TriggerEvent | TriggerEvent[]
}

export interface PopupCoords {
  '--origin-x': string
  '--origin-y': string
  'left': number | string
  'top': number | string
}

export interface ArrowCoords {
  left: number
  top: number
  transform: string
}

export type ElementCoords = ReturnType<typeof getElementCoords>

export type HorizontalMainAxis = 'left' | 'right'
export type VerticalMainAxis = 'bottom' | 'top'
export type MainAxis = HorizontalMainAxis | VerticalMainAxis

export type HorizontalCrossAxis = 'bottom' | 'center' | 'top'
export type VerticalCrossAxis = 'center' | 'left' | 'right'
export type CrossAxis = HorizontalCrossAxis | VerticalCrossAxis

export interface ScreenCoords {
  /** keep arrow center 时调整的距离 */
  _delta: number
  /** 真实高度 */
  _height: number
  /** 屏幕宽度 */
  _mx: number
  /** 屏幕高度 */
  _my: number
  // /** 真实宽度 */
  _width: number
  /** 交叉轴 */
  cross: CrossAxis
  /** 水平方向偏移量 */
  left: number
  /** 主轴 */
  main: MainAxis
  /** 垂直方向偏移量 */
  top: number
}

export type OriginCoords = Pick<ScreenCoords, 'left' | 'top'>

export interface AlignerConfig {
  // 翻转
  flipPopupCoords: (
    props: InternalTooltipProps,
    screen: ScreenCoords,
    trigger: ElementCoords,
  ) => ScreenCoords

  // 箭头位置
  getArrowCoords: (screen: ScreenCoords, trigger: ElementCoords) => ArrowCoords

  // 转换原点
  getOriginCoords: (arrow: ArrowCoords, screen: ScreenCoords) => OriginCoords

  // 相对于 viewport 的坐标
  getScreenCoords: (
    props: InternalTooltipProps,
    popup: ElementCoords,
    trigger: ElementCoords,
  ) => ScreenCoords

  keepArrowCenter: (
    props: InternalTooltipProps,
    screen: ScreenCoords,
    trigger: ElementCoords,
  ) => ScreenCoords

  // 调整
  shiftPopupCoords: (
    props: InternalTooltipProps,
    screen: ScreenCoords,
    trigger: ElementCoords,
  ) => ScreenCoords
}

/**
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 * |                      default props                      |
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 */

export const defaultInternalTooltipProps: Partial<InternalTooltipProps> = {
  arrow: true,
  closeDelay: 200,
  defaultOpen: false,
  flip: true,
  offset: 0,
  openDelay: 100,
  placement: 'top',
  shift: true,
  trigger: 'hover',
}
