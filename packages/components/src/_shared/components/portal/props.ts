import type { MayBe } from '@kpi-ui/types'

import { type GetTargetElement } from '@kpi-ui/utils'

export type ContainerType = Element | false

export type PortalRef = MayBe<ContainerType>

export interface PortalProps {
  children?: React.ReactNode

  /** 自定义容器, 会执行多次. 为 false 时表示不使用 portal */
  getContainer?: GetTargetElement<ContainerType>
}
