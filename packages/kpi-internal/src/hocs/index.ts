/* eslint-disable no-param-reassign */
import type { FC } from 'react'

type UnionProp<P, D> = {
  [K in keyof D]+?: K extends keyof P ? P[K] : D[K]
} & Omit<P, keyof D>

type SomeDefault<T extends object> = Readonly<Partial<T>>

/**
 *
 * @param WrappedComponent 需要包装的组件
 * @param defaultProps 默认属性, 推荐 as const 使用, 避免多生成类型
 */
export default function withDefaults<
  P extends Record<string, any>,
  D extends SomeDefault<P> = SomeDefault<P>
>(WrappedComponent: FC<P>, defaultProps?: D) {
  WrappedComponent.defaultProps = defaultProps

  // 生产环境去除 displayName
  if (process.env.NODE_ENV !== 'production') {
    WrappedComponent.displayName = WrappedComponent.name
  }

  return WrappedComponent as FC<UnionProp<P, D>>
}
