import { useEvent } from '@kpi-ui/hooks'
import { withoutProperties } from '@kpi-ui/utils'
import { cloneElement, isValidElement, useRef } from 'react'
import { LayoutContext } from '../_shared/context'
import CSSTransition from '../css-transition'

import type { CSSTransitionRef } from '../css-transition/props'
import type { LayoutTransitionProps } from './props'

const excluded = ['id', 'children', 'appear'] as const

function LayoutTransition<E extends HTMLElement = HTMLElement>(props: LayoutTransitionProps<E>) {
  const { children, id } = props

  const layoutContext = LayoutContext.useState()

  const $transition = useRef<CSSTransitionRef<E>>(null)

  const $instance = useRef<E | null>()

  const refCallback = useEvent((el: E | null) => {
    if (!el && $instance.current) {
      layoutContext.states.set(id, {
        rect: $instance.current.getBoundingClientRect(),
        style: getComputedStyle($instance.current),
      })
    }

    $instance.current = el
  })

  if (!isValidElement(children)) return children

  const attrs = withoutProperties(props, excluded)

  return (
    <CSSTransition
      ref={$transition}
      {...attrs}
      onEnter={(el, appearing) => {
        attrs.onEnter && attrs.onEnter(el, appearing)
        if (appearing) layoutContext.onReady(el, layoutContext.states.get(id))
      }}
      when
      appear
      unmountOnExit
    >
      {cloneElement(children as any, { ref: refCallback })}
    </CSSTransition>
  )
}

export default LayoutTransition
