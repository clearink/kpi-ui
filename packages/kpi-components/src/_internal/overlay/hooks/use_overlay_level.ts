// utils
import { useConstant, useWatchValue } from '@kpi-ui/hooks'
import { isUndefined } from '@kpi-ui/utils'
import { ZIndexContext } from '../../../_shared/context'
// types
import type { OverlayProps } from '../props'
import type { OverlayStore } from './use_overlay_store'

export default function useOverlayLevel(store: OverlayStore, props: OverlayProps) {
  const { open, zIndex } = props

  const { getZIndex } = ZIndexContext.useState()

  const isControlled = !isUndefined(zIndex)

  const level = useConstant(() => ({
    value: isControlled || (!open && !store.isMounted) ? 0 : getZIndex(),
  }))

  useWatchValue(open, () => {
    if (open && !isControlled) level.value = getZIndex()
  })

  return isControlled ? zIndex : level.value
}
