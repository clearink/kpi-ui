// types
import type { ComponentType } from 'react'

export function withDisplayName<S>(WrappedComponent: ComponentType<S>, explicitName?: string) {
  if (process.env.NODE_ENV !== 'production') {
    WrappedComponent.displayName = explicitName || WrappedComponent.name
  }

  return WrappedComponent
}
