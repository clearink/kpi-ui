import type { ReactRef } from '@kpi-ui/types'
import { isFunction, mergeRefs, supportRef, withDisplayName } from '@kpi-ui/utils'
import { cloneElement, forwardRef } from 'react'

import type { ForwardFunctionalProps } from './props'

function ForwardFunctional<T extends React.ReactElement, R extends ReactRef<any>>(
  props: ForwardFunctionalProps<T, R>,
  ref: R
) {
  const { children } = props

  if (isFunction(children)) return children(ref)

  return supportRef(children)
    ? cloneElement(children, { ref: mergeRefs(ref, children.ref) })
    : children
}

export default withDisplayName(forwardRef(ForwardFunctional), 'ForwardFunctional') as <
  T extends React.ReactElement,
  R extends ReactRef<any> = ReactRef<any>
>(
  props: ForwardFunctionalProps<T, R> & React.RefAttributes<R>
) => JSX.Element
