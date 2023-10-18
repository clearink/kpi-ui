/* eslint-disable no-param-reassign */
import { withDefaults } from '@kpi/internal'
import { isFunction } from '@kpi/shared'
import { cloneElement, useRef } from 'react'
import { useTransition } from '../_internal/hooks'
import { ENTER, ENTERED, ENTERING, EXIT, EXITED, EXITING } from '../_internal/constant'

import type { CollapseProps } from './props'
import type { TransitionStatus } from '../_internal/constant'

const addStyle = (node: HTMLElement, attr: string, value: any) => {
  if (!node) return
  ;(node as any).style[attr] = value
}

function Collapse<T>(props: CollapseProps<T>) {
  const { open, timeout = 300, children, nodeRef } = props

  const ref = useRef<HTMLElement>()

  const handleOnChange = (status: TransitionStatus) => {
    if (status === ENTER) {
      addStyle(ref.current!, 'height', '0px')
    } else if (status === ENTERING) {
      const fullHeight = ref.current?.scrollHeight || 0
      addStyle(ref.current!, 'height', `${fullHeight}px`)
    } else if (status === ENTERED) {
      addStyle(ref.current!, 'height', 'auto')
    } else if (status === EXIT) {
      const fullHeight = ref.current?.scrollHeight || 0
      addStyle(ref.current!, 'height', `${fullHeight}px`)
    } else if (status === EXITING) {
      addStyle(ref.current!, 'height', '0px')
    } else if (status === EXITED) {
      addStyle(ref.current!, 'height', '0px')
    }
  }

  const { status, mounted } = useTransition(open, {
    timeout,
    unmountOnExit: true,
    onChange: handleOnChange,
  })

  if (!mounted) return null

  if (isFunction(children)) return children(status, {})

  return cloneElement(children, { ref: nodeRef ?? ref })
}

export default withDefaults(Collapse)
