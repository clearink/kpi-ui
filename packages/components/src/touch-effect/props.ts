import type { ReactElement } from 'react'

export interface TouchEffectProps {
  children: ReactElement
  component: string
  disabled?: boolean
  selector?: ((container: HTMLElement) => HTMLElement | null) | string
}
