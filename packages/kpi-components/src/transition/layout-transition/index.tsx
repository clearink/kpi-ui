import { useEffect, useMemo, useRef } from 'react'
import { LayoutContext } from '../_shared/context'
import CSSTransition from '../css-transition'
import type { LayoutTransitionProps } from './props'
import type { CSSTransitionRef } from '../css-transition/props'

function LayoutTransition<E extends HTMLElement = HTMLElement>(props: LayoutTransitionProps<E>) {
  const { children, id } = props

  const $transition = useRef<CSSTransitionRef<E>>(null)

  const layoutContext = LayoutContext.useState()

  const handlers = useMemo(
    () => ({
      onEnter: (el: E, appearing: boolean) => {
        if (!layoutContext.exist(id) || !appearing) layoutContext.register($transition.current, id)

        const coords = layoutContext.coords(id)

        if (!coords || !appearing) return

        const rect = el.getBoundingClientRect()

        el.style.transform = `translate3d(${coords.x - rect.x}px,${coords.y - rect.y}px,0) scale(${
          coords.width / rect.width
        },${coords.height / rect.height})`

        console.log(el.style.transform)
      },
      onEntering: (el: E) => {
        el.style.transformOrigin = '50% 50% 0px'
        el.style.opacity = '1'
        el.style.transform = `translate3d(0px,0px,0) scale(1, 1)`
        el.style.transition = 'transform 0.3s ease-in-out'
      },
      onEntered: (el: E) => {
        el.style.opacity = ''
        el.style.transformOrigin = ''
        el.style.transform = ''
        el.style.transition = ''
        layoutContext.register($transition.current, id)
      },
      onExit: (el: E) => {
        console.log('exited', el)
      },
    }),
    [layoutContext, id]
  )

  return (
    <CSSTransition {...props} {...handlers} when appear unmountOnExit ref={$transition}>
      {children}
    </CSSTransition>
  )
}

export default LayoutTransition
