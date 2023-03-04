import type { ReactElement, Ref } from 'react'
import type { TransitionOptions } from '../_internal/hooks'
import type { TransitionStatus } from '../_internal/constant'

export interface CollapseProps<T> {
  nodeRef?: Ref<T>
  children: ReactElement | ((status: TransitionStatus, childProps: any) => ReactElement)
  open: boolean
  timeout?: TransitionOptions['timeout']
}

export interface ZoomProps {
  children: ReactElement | ((status: TransitionStatus, childProps: any) => ReactElement)
  open: boolean
  timeout?: TransitionOptions['timeout']
}
