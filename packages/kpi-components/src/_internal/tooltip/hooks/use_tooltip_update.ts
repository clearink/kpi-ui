import { useEvent } from '@kpi-ui/hooks'
import { nextTick } from '@kpi-ui/utils'
import { useEffect, useRef } from 'react'
import useTooltipStore from './use_tooltip_store'
// types
import type { InternalTooltipProps } from '../props'

export default function useTooltipUpdate(
  actions: ReturnType<typeof useTooltipStore>['actions'],
  props: InternalTooltipProps,
  open: boolean
) {
  const cleanupTick = useRef(() => {})

  // prettier-ignore
  useEffect(() => () => { cleanupTick.current() }, [])

  return useEvent(() => {
    cleanupTick.current()

    cleanupTick.current = nextTick(() => {
      open && actions.updateCoords(props)
    })
  })
}
