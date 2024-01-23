// types
import type { HasChildren } from '@kpi-ui/types'

export interface FocusTrapProps extends HasChildren {
  open?: boolean

  getTabbable?: (el: HTMLElement) => NodeListOf<HTMLElement>
}
