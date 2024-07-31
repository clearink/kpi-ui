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

  const cleanOffset = () => { !hasError && setOffset(0) }

  const updateOffset = useEvent((isForceUpdate: boolean) => {
    const $outer = getOuter()

    if (!hasError || !$outer) return false

    const styles = getElementStyle($outer)

    setOffset(Number.parseFloat(styles.marginBottom))

    if (isForceUpdate) forceUpdate()

    return true
  })

  const returnEarly = useWatchValue(hasError, () => updateOffset(true))

  useEffect(() => nextTick(() => { updateOffset(false) }), [updateOffset])

  return { returnEarly, offset: states.offset, cleanOffset }
}
