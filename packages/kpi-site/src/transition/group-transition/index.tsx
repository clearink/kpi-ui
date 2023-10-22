import { omit } from '@kpi/shared'
import { Children, Fragment, createElement } from 'react'
import CSSTransition from '../css-transition'

import type { GroupTransitionProps } from './props'

export default function GroupTransition<E extends HTMLElement = HTMLElement>(
  props: GroupTransitionProps<E>
) {
  const { children } = props

  const cssProps = omit(props, ['children', 'when', 'unmountOnExit'])

  const elements = Children.map(children, (child) => (
    <CSSTransition appear when {...cssProps}>
      {child}
    </CSSTransition>
  ))

  return createElement(Fragment, undefined, elements)
}
