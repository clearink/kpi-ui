import { HTMLAttributes } from 'react'
import { Breakpoint } from '../_shard/constant'

/* ------------------------------ row ------------------------------ */
export type AlignType = ['top', 'middle', 'bottom', 'stretch'][number]
export type JustifyType = ['start', 'end', 'center', 'space-around', 'space-between'][number]
export type Gutter = number | Partial<Record<Breakpoint, number>>
export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  align: AlignType
  gutter: Gutter | [Gutter, Gutter]
  justify: JustifyType
  wrap: boolean
}

/* ------------------------------ col ------------------------------- */

export type FlexType = number | LiteralUnion<'none' | 'auto', string>
export type ColSpanType = string | number
export interface ColSize {
  flex?: FlexType
  span?: ColSpanType
  order?: ColSpanType
  offset?: ColSpanType
  push?: ColSpanType
  pull?: ColSpanType
}
export interface ColProps
  extends ColSize,
    HTMLAttributes<HTMLDivElement>,
    Partial<Record<Breakpoint, ColSpanType | ColSize>> {}
