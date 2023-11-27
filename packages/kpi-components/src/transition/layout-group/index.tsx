import { useMemo } from 'react'
import { LayoutContext, type LayoutContextState } from '../_shared/context'

import type { LayoutGroupProps } from './props'
import { useEvent } from '@kpi-ui/hooks'

function LayoutGroup(props: LayoutGroupProps) {
  const { children, onReady: _onReady, onRunning: _onRunning, onFinish: _onFinish } = props

  const onReady = useEvent<NonNullable<LayoutGroupProps['onReady']>>((el, state) => {
    _onReady && _onReady(el, state)
  })

  const onRunning = useEvent<NonNullable<LayoutGroupProps['onRunning']>>((el) => {
    _onRunning && _onRunning(el)
  })

  const onFinish = useEvent<NonNullable<LayoutGroupProps['onFinish']>>((el) => {
    _onFinish && _onFinish(el)
  })

  const layoutContext = useMemo<LayoutContextState>(() => {
    return { states: new Map(), onReady, onRunning, onFinish }
  }, [onFinish, onReady, onRunning])

  return <LayoutContext.Provider value={layoutContext}>{children}</LayoutContext.Provider>
}

export default LayoutGroup
