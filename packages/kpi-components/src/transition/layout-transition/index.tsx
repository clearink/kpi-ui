import { useEvent } from '@kpi-ui/hooks'
import { withoutProperties } from '@kpi-ui/utils'
import { cloneElement, isValidElement, useRef } from 'react'
import { LayoutContext } from '../_shared/context'
import CSSTransition from '../css-transition'

import type { CSSTransitionRef } from '../css-transition/props'
import type { LayoutTransitionProps } from './props'

const excluded = ['id', 'children'] as const

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
      when
      appear
      unmountOnExit
      onEnter={(el, appearing) => {
        attrs.onEnter && attrs.onEnter(el, appearing)

        const state = layoutContext.states.get(id)

        if (!appearing || !state) return

        const rect = el.getBoundingClientRect()

        const sx = state.rect.width / rect.width
        const sy = state.rect.height / rect.height
        const ox = state.rect.x - rect.x + (state.rect.width - rect.width) / 2
        const oy = state.rect.y - rect.y + (state.rect.height - rect.height) / 2

        layoutContext.onEnter({ el, offset: [ox, oy], scale: [sx, sy], state })
      }}
      onEntering={(el, appearing) => {
        attrs.onEntering && attrs.onEntering(el, appearing)
        layoutContext.onEntering(el)
      }}
      onEntered={(el, appearing) => {
        attrs.onEntered && attrs.onEntered(el, appearing)
        layoutContext.onEntered(el)
      }}
    >
      {cloneElement(children as any, { ref: refCallback })}
    </CSSTransition>
  )
}

export default LayoutTransition
