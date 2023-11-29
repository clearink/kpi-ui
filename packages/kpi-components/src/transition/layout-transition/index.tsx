import { useEvent } from '@kpi-ui/hooks'
import { fallback, noop, withDefaults, withoutProperties } from '@kpi-ui/utils'
import { cloneElement, isValidElement, useRef } from 'react'
import { LayoutContext } from '../_shared/context'
import CSSTransition from '../css-transition'
import coords from './utils/coords'

import type { CSSTransitionRef } from '../css-transition/props'
import type { LayoutTransitionProps } from './props'

const excluded = ['id', 'children', 'getCustomState'] as const

function LayoutTransition<E extends HTMLElement = HTMLElement>(props: LayoutTransitionProps<E>) {
  const { children, id, getCustomState: getState } = props

  const layoutContext = LayoutContext.useState()

  const $transition = useRef<CSSTransitionRef<E>>(null)

  const $instance = useRef<E | null>()

  const refCallback = useEvent((el: E | null) => {
    const { states } = layoutContext

    const pre = $instance.current

    const get = fallback(getState, noop)

    if (!el && pre) states.set(id, { ...get!(pre), rect: coords(pre) })

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

        layoutContext.onReady({ el, offset: [ox, oy], scale: [sx, sy], state })
      }}
      onEntering={(el, appearing) => {
        attrs.onEntering && attrs.onEntering(el, appearing)
        layoutContext.onRunning(el)
      }}
      onEntered={(el, appearing) => {
        attrs.onEntered && attrs.onEntered(el, appearing)
        layoutContext.onFinish(el)
      }}
    >
      {cloneElement(children as any, { ref: refCallback })}
    </CSSTransition>
  )
}

export default LayoutTransition
