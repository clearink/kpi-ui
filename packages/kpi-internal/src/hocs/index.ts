/* eslint-disable no-param-reassign */
import type { ComponentType } from 'react'

type UnionProp<P, D> = {
  [K in keyof D]+?: K extends keyof P ? P[K] : D[K]
} & Omit<P, keyof D>

type SomeDefault<T extends object> = Readonly<Partial<T>>

/**
 *
 * @param WrappedComponent 需要包装的组件
 * @param defaultProps 默认熟悉, 推荐 as const 使用, 避免多生成类型
 */
export default function withDefaultProps<
  P extends object,
  D extends SomeDefault<P> = SomeDefault<P>
>(WrappedComponent: ComponentType<P>, defaultProps?: D) {
  WrappedComponent.defaultProps = defaultProps

  // 生产环境去除 displayName
  if (process.env.NODE_ENV !== 'production') {
    WrappedComponent.displayName = WrappedComponent.name
  }

  return WrappedComponent as ComponentType<UnionProp<P, D>>
}
