import type { ReactRef } from '@kpi-ui/types'

export interface ForwardFunctionalProps<T extends React.ReactElement, R extends ReactRef<any>> {
  children: ((ref: R) => T) | T
}
