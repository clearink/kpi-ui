import { cloneElement, isValidElement, useMemo, useRef } from 'react'
import { LayoutContext } from '../_shared/context'
import CSSTransition from '../css-transition'

import type { LayoutTransitionProps } from './props'
import type { CSSTransitionRef } from '../css-transition/props'
import { useEvent } from '@kpi-ui/hooks'

function LayoutTransition<E extends HTMLElement = HTMLElement>(props: LayoutTransitionProps<E>) {
  const { children, id } = props

  const layoutContext = LayoutContext.useState()

  const $transition = useRef<CSSTransitionRef<E>>(null)

  const $instance = useRef<E | null>()

  const refCallback = (el: E | null) => {
    if (!el && $instance.current) {
      layoutContext.register($instance.current.getBoundingClientRect(), id)
    }
    $instance.current = el
  }

  const handlers = useMemo(
    () => ({
      onEnter: (el: E, appearing: boolean) => {
        const coords = layoutContext.coords(id)

        if (!coords || !appearing) return

        const rect = el.getBoundingClientRect()

        el.style.transform = `translate3d(${coords.x - rect.x}px,${coords.y - rect.y}px,0) scale(${
          coords.width / rect.width
        },${coords.height / rect.height})`

        console.log(el.style.transform, coords, rect)
      },
      onEntering: (el: E) => {
        el.style.transformOrigin = '50% 50% 0px'
        el.style.opacity = '1'
        el.style.transform = `translate3d(0px,0px,0) scale(1, 1)`
        el.style.transition = 'transform 111110.3s ease-in-out'
      },
      onEntered: (el: E) => {
        el.style.opacity = ''
        el.style.transformOrigin = ''
        el.style.transform = ''
        el.style.transition = ''
      },
    }),
    [layoutContext, id]
  )

  if (!isValidElement(children)) return children

  return (
    <CSSTransition {...props} {...handlers} when appear unmountOnExit ref={$transition}>
      {cloneElement(children as any, { ref: refCallback })}
    </CSSTransition>
  )
}

export default LayoutTransition
