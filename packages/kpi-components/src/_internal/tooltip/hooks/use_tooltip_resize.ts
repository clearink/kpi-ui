import { useEvent, useUnmountEffect } from '@kpi-ui/hooks'
import { caf, ownerWindow, raf } from '@kpi-ui/utils'
import { useEffect } from 'react'
import { addListener } from '../../transition/_shared/utils'
import getScrollable from '../utils/scrollable'
import useTooltipStore from './use_tooltip_store'
// types
import type { InternalTooltipProps } from '../props'

export default function useTooltipResize(
  states: ReturnType<typeof useTooltipStore>['states'],
  actions: ReturnType<typeof useTooltipStore>['actions'],
  props: InternalTooltipProps,
  open: boolean
) {
  const onChange = useEvent(() => {
    if (states.frameId >= 0) return

    states.frameId = raf(() => {
      states.frameId = -1

      open && actions.updateCoords(props)
    })
  })

  // prettier-ignore
  useUnmountEffect(() => { caf(states.frameId) })

  useEffect(() => {
    if (!open) return

    const root = ownerWindow(actions.trigger) as any

    return addListener(root, 'scroll', onChange, { passive: true })
  }, [open, actions, onChange])

  return onChange
}
