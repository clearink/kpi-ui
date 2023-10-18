import { withDefaults } from '@kpi/internal'
import { isFunction, logger } from '@kpi/shared'
import { cloneElement, isValidElement } from 'react'
import { useTransition } from '../_internal/hooks'

import type { TransitionStatus } from '../_internal/constant'
import type { CollapseProps, ZoomProps } from './props'

function Grow(props: ZoomProps) {
  const { open, timeout = 300, children } = props

  const handleOnChange = (status: TransitionStatus, appearing: boolean) => {
    console.log('status', status)
  }

  const { status, mounted } = useTransition(open, { timeout, onChange: handleOnChange })

  if (process.env.NODE_ENV !== 'production') {
    logger(!isValidElement(children), 'Zoom children must be validElement')
  }

  if (!mounted) return null

  if (isFunction(children)) return children(status, {})

  return cloneElement(children)
}

export default withDefaults(Grow)
