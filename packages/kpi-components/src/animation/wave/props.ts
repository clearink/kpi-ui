import type { ReactElement } from 'react'

export interface WaveProps {
  children: ReactElement
  disabled?: boolean | ((target: HTMLElement) => boolean)
}
