import type { VoidFn } from '@internal/types'

import { useConstant, useEvent } from '@comps/_shared/hooks'
import { addClassNames, caf, delClassNames, execute, getClientCoords, raf, reflow } from '@internal/utils'
import { useEffect } from 'react'

import type { FlipState, GroupTransitionProps } from '../props'
import type { TransitionState } from './use_transition_store'

export default function useTransitionFlip<E extends HTMLElement>(
  props: GroupTransitionProps<E>,
  states: TransitionState<E>,
) {
  const { name, flip } = props

  const isCanFlip = useEvent(() => name && flip)

  const values = useConstant<FlipState>(() => ({
    coords: new Map(),
    cancels: [],
  }))

  const getCoords = () => {
    return states.previous.reduce((map, node) => {
      const el = states.components.get(node.key)?.instance

      if (el) map.set(node.key, getClientCoords(el))

      return map
    }, new Map() as FlipState['coords'])
  }

  const updateCoords = () => {
    values.coords = getCoords()
  }

  const setCancels = (cancels: FlipState['cancels']) => {
    values.cancels = cancels
  }

  const runCleanup = useEvent(() => {
    values.cancels.forEach(execute)

    values.cancels = []
  })

  const runFlip = useEvent(() => {
    runCleanup()

    const id = raf(() => {
      const handlers: ({ el: HTMLElement, move: () => VoidFn })[] = []

      getCoords().forEach((newCoord, key) => {
        const oldCoord = values.coords.get(key)

        const comp = states.components.get(key)

        const dom = comp && comp.instance

        if (!oldCoord || !dom) return

        const dx = oldCoord.left - newCoord.left

        const dy = oldCoord.top - newCoord.top

        if (!dx && !dy) return

        const oldTransform = dom.style.transform
        const oldDuration = dom.style.transitionDuration

        dom.style.transform = `translate(${dx}px, ${dy}px)`
        dom.style.transitionDuration = '0s'

        handlers.push({
          el: dom,
          move: () => {
            addClassNames(dom, name && `${name}-move`)

            dom.style.transform = oldTransform
            dom.style.transitionDuration = oldDuration

            const handler = () => {
              delClassNames(dom, name && `${name}-move`)
              dom.removeEventListener('transitionend', handler)
            }

            dom.addEventListener('transitionend', handler)

            return handler
          },
        })
      })

      handlers.forEach((item) => { reflow(item.el) })

      setCancels(handlers.map(item => item.move()))
    })

    return () => { caf(id) }
  })

  useEffect(() => runCleanup, [runCleanup])

  return { isCanFlip, updateCoords, runFlip }
}
