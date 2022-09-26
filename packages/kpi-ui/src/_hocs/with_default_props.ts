import { ComponentType } from 'react'

type UnionProp<P, D> = {
  [K in keyof D]+?: K extends keyof P ? P[K] : D[K]
} & Omit<P, keyof D>
type SomeDefault<T extends object> = Readonly<Partial<T>>
export default function withDefaultProps<
  P extends object,
  D extends SomeDefault<P> = SomeDefault<P>
>(
  WrappedComponent: ComponentType<P>,
  defaultProps?: D // 推荐 as const 使用, 避免多生成类型
) {
  WrappedComponent.defaultProps = defaultProps
  WrappedComponent.displayName = WrappedComponent.name
  return WrappedComponent as ComponentType<UnionProp<P, D>>
}
