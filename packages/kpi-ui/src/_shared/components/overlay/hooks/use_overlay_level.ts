import { isUndefined } from '@kpi-ui/utils'
import { ZIndexContext } from '_shared/contexts'
import { useConstant, useWatchValue } from '_shared/hooks'
// types
import type { OverlayProps } from '../props'

export default function useOverlayLevel(isMounted: boolean, props: OverlayProps) {
  const { open, zIndex } = props

  const { getZIndex } = ZIndexContext.useState()

  const isControlled = !isUndefined(zIndex)

  const level = useConstant(() => ({
    value: isControlled || (!open && !isMounted) ? 0 : getZIndex(),
  }))

  useWatchValue(open, () => {
    if (open && !isControlled) level.value = getZIndex()
  })

  return isControlled ? zIndex : level.value
}
