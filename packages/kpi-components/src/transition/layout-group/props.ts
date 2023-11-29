import type { CSSProperties, ComponentType, ReactNode } from 'react'

export interface SharedLayoutState {
  rect: DOMRect
}
export interface LayoutGroupProps<
  E extends HTMLElement = HTMLElement,
  R extends Record<string, any> = Record<string, any>
> {
  tag?: keyof HTMLElementTagNameMap | ComponentType

  children: ReactNode

  onReady?: (params: {
    el: E
    offset: [number, number]
    scale: [number, number]
    state: SharedLayoutState & R
  }) => void

  onRunning?: (el: E) => void

  onFinish?: (el: E) => void

  style?: CSSProperties

  className?: string

  [key: string]: any
}
