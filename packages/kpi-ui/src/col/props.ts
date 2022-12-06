import { HTMLAttributes } from 'react'
import { Breakpoint } from '../.internal/constant/breakpoint'
import { LiteralUnion } from '../.internal/types'

export type FlexType = number | LiteralUnion<'none' | 'auto', string>
export type ColSpanType = number
export interface ColSize {
  flex?: FlexType
  offset?: ColSpanType
  order?: ColSpanType
  pull?: ColSpanType
  push?: ColSpanType
  span?: ColSpanType
}
export type ResponsiveColSize = Record<Breakpoint, ColSpanType | ColSize>
export interface ColProps
  extends ColSize,
    HTMLAttributes<HTMLDivElement>,
    Partial<ResponsiveColSize> {}
