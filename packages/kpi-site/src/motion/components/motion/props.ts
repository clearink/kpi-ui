import type { ComponentType, CSSProperties, ReactNode } from 'react'

export interface MotionProps {
  tag?: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | ComponentType
  children?: ReactNode
  style?: CSSProperties
}
