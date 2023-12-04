import { useEvent } from '@kpi-ui/hooks'
import { fallback, noop, withoutProperties } from '@kpi-ui/utils'
import { cloneElement, isValidElement, useRef } from 'react'
import { LayoutContext } from '../_shared/context'
import CSSTransition from '../css-transition'
import coords from './utils/coords'

import type { CSSTransitionRef } from '../css-transition/props'
import type { LayoutTransitionProps } from './props'

const excluded = ['id', 'children', 'addCustomState'] as const

function LayoutTransition<E extends HTMLElement = HTMLElement>(props: LayoutTransitionProps<E>) {
  const { children, id, addCustomState: add } = props

  const layoutContext = LayoutContext.useState()

  const $transition = useRef<CSSTransitionRef<E>>(null)

  const $instance = useRef<E | null>(null)

  const refCallback = useEvent((current: E | null) => {
    const { states } = layoutContext

    states.save<E>(id, $instance.current, current, (el) => {
      return { ...fallback(add, noop)!(el), rect: coords(el) }
    })

    $instance.current = current
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

        const sx = rect.width ? state.rect.width / rect.width : 1
        const sy = rect.height ? state.rect.height / rect.height : 1
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

/**
 * 目前是错误记录了位置信息，在此需要将情况列出来
 * 1. 挂载与卸载时需要分别获取一次数据？
 */
