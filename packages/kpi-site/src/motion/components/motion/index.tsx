import { createElement } from 'react'
import type { ComponentType, ReactNode } from 'react'

export interface MotionProps {
  tag?: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | ComponentType
  children?: ReactNode
}

export default function Motion(props: MotionProps) {
  const { tag = 'div', children } = props
  return createElement(tag, {}, children)
}
