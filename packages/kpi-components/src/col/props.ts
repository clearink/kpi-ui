import type { LiteralUnion } from '@kpi-ui/types'
import type { HTMLAttributes } from 'react'
import type { Breakpoint } from '_shared/hooks/use-breakpoint/breakpoint'

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

export type ColProps = ColSize & HTMLAttributes<HTMLDivElement> & Partial<ResponsiveColSize>
