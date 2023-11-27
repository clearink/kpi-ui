import type { ReactNode } from 'react'

export interface ElementLayoutState {
  rect: DOMRect
  style: CSSStyleDeclaration
}
export interface LayoutGroupProps<E extends HTMLElement = HTMLElement> {
  children: ReactNode
  onReady?: (el: E, state: ElementLayoutState | undefined) => void
  onRunning?: (el: E) => void
  onFinish?: (el: E) => void
}
