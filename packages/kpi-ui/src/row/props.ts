import { HTMLAttributes } from 'react'
import { Breakpoint } from '../_internal/constant'

export type AlignType = ['top', 'middle', 'bottom', 'stretch'][number]
export type JustifyType = [
  'start',
  'end',
  'center',
  'space-around',
  'space-between',
  'space-evenly'
][number]
export type Gutter = number | Partial<Record<Breakpoint, number>>
export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  align?: AlignType
  justify?: JustifyType
  gutter: Gutter | [Gutter, Gutter]
  wrap: boolean
}
