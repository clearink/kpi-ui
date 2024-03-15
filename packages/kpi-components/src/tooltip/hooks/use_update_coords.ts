import { useEvent } from '@kpi-ui/hooks'
import { nextTick, noop } from '@kpi-ui/utils'
import { useEffect, useRef } from 'react'
import useTooltipStore from './use_tooltip_store'
// types
import type { TooltipProps } from '../props'

export default function useUpdateCoords(
  actions: ReturnType<typeof useTooltipStore>['actions'],
  props: TooltipProps,
  open: boolean
) {
  const cleanupTick = useRef(noop)

  // prettier-ignore
  useEffect(() => () => { cleanupTick.current() }, [])

  return useEvent(() => {
    cleanupTick.current()

    cleanupTick.current = nextTick(() => {
      open && actions.updateCoords(props)
    })
  })
}
