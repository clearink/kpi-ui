import type { HasChildren } from '@kpi-ui/types'

export interface ShouldUpdateProps extends HasChildren {
  when: boolean | (() => boolean)
}
