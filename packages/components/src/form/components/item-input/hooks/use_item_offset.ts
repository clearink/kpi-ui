import { useConstant, useEvent, useForceUpdate, useWatchValue } from '@comps/_shared/hooks'
import { getElementStyle, nextTick } from '@internal/utils'
import { useEffect } from 'react'

import type { FormItemInputProps } from '../props'

export default function useItemInputOffset(props: FormItemInputProps, hasError: boolean) {
  const { getOuter } = props

  const forceUpdate = useForceUpdate()

  const states = useConstant(() => ({ offset: 0 }))

  const setOffset = (offset: number) => {
    if (states.offset !== offset) forceUpdate()

    states.offset = offset
  }

  const updateOffset = useEvent(() => {
    const $outer = getOuter()

    if (!hasError || !$outer) return

    const styles = getElementStyle($outer)

    setOffset(Number.parseFloat(styles.marginBottom))
  })

  let returnEarly = false

  useWatchValue(hasError, () => {
    returnEarly = hasError && !!getOuter()

    updateOffset()

    if (returnEarly) forceUpdate()
  })

  useEffect(() => nextTick(updateOffset), [updateOffset])

  const handleCleanOffset = () => { !hasError && setOffset(0) }

  return { returnEarly, offset: states.offset, handleCleanOffset }
}
