import type { CSSProperties, ComponentType, ReactNode } from 'react'

export interface LayoutSharedData {
  rect: DOMRect
  style: CSSStyleDeclaration
}
export interface LayoutGroupProps<E extends HTMLElement = HTMLElement> {
  tag?: keyof HTMLElementTagNameMap | ComponentType

  children: ReactNode

  onEnter?: (params: {
    el: E
    offset: [number, number]
    scale: [number, number]
    state: LayoutSharedData
  }) => void

  onEntering?: (el: E) => void

  onEntered?: (el: E) => void

  style?: CSSProperties

  className?: string

  [key: string]: any
}
