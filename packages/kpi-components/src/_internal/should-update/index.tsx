import { isFunction, withDisplayName } from '@kpi-ui/utils'
import { memo } from 'react'
// types
import type { ShouldUpdateProps } from './props'

export default withDisplayName(
  memo(
    (props: ShouldUpdateProps) => props.children as React.ReactElement,
    (_, { when }) => !(isFunction(when) ? when() : when)
  ),
  'ShouldUpdate'
)
