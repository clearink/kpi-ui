// utils
import { isFunction, mergeRefs, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef } from 'react'
// types
import type { ReactRef } from '@kpi-ui/types'
import type { ForwardFunctionalProps } from './props'

function ForwardFunctional<T extends React.ReactElement, R extends ReactRef<any>>(
  props: ForwardFunctionalProps<T, R>,
  ref: R
) {
  const { children } = props

  if (isFunction(children)) return children(ref)

  return cloneElement(children, { ref: mergeRefs(ref, (children as any).ref) })
}

export default withDisplayName(forwardRef(ForwardFunctional), 'ForwardFunctional') as <
  T extends React.ReactElement,
  R extends ReactRef<any> = ReactRef<any>
>(
  props: ForwardFunctionalProps<T, R> & { ref?: R }
) => JSX.Element
