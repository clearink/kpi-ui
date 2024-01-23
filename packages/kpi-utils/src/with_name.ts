import type { ComponentType } from 'react'

/**
 *
 * @param WrappedComponent 需要包装的组件
 */
export default function withDisplayName<S>(WrappedComponent: ComponentType<S>) {
  // 生产环境去除 displayName
  if (process.env.NODE_ENV !== 'production') {
    WrappedComponent.displayName = WrappedComponent.name
  }

  return WrappedComponent
}
