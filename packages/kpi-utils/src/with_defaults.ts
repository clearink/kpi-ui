import type { ComponentType } from 'react'

/**
 *
 * @param WrappedComponent 需要包装的组件
 * @param defaultProps 默认属性
 */
export default function withDefaults<P extends ComponentType<any>>(
  WrappedComponent: P,
  defaultProps?: P['defaultProps']
) {
  WrappedComponent.defaultProps = defaultProps

  // 生产环境去除 displayName
  if (process.env.NODE_ENV !== 'production') {
    WrappedComponent.displayName = WrappedComponent.name
  }

  return WrappedComponent
}
