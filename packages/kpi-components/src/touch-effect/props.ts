import type { ReactElement } from 'react'

export interface TouchEffectProps {
  children: ReactElement
  disabled?: boolean | ((event: MouseEvent) => boolean)
}
