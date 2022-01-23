import { ComponentType } from 'react'

type UnionProp<P, D> = Omit<P, keyof D> & Partial<D>
export default function withDefaultProps<P extends object, D extends Partial<P> = Partial<P>>(
  WrappedComponent: ComponentType<P>,
  defaultProps?: D
) {
  WrappedComponent.defaultProps = defaultProps
  return WrappedComponent as ComponentType<UnionProp<P, D>>
}
