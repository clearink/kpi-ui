import { useEvent } from '@kpi-ui/hooks'
import { isNullish, withoutProperties } from '@kpi-ui/utils'
import { createElement, useMemo } from 'react'
import { LayoutContext } from '../_shared/context'

import type { LayoutGroupProps } from './props'

const excluded = ['tag', 'children', 'onReady', 'onRunning', 'onFinish'] as const

function LayoutGroup<
  E extends HTMLElement = HTMLElement,
  R extends Record<string, any> = Record<string, any>
>(props: LayoutGroupProps<E, R>) {
  const {
    tag,
    children: _children,
    onReady: _onReady,
    onRunning: _onRunning,
    onFinish: _onFinish,
  } = props

  const onReady = useEvent((params) => _onReady && _onReady(params))

  const onRunning = useEvent((el) => _onRunning && _onRunning(el))

  const onFinish = useEvent((el) => _onFinish && _onFinish(el))

  const layoutContext = useMemo(() => {
    return { states: new Map(), onReady, onRunning, onFinish }
  }, [onFinish, onReady, onRunning])

  const children = (
    <LayoutContext.Provider value={layoutContext}>{_children}</LayoutContext.Provider>
  )

  if (isNullish(tag)) return children

  const attrs = withoutProperties(props, excluded)

  return createElement(tag, attrs, children)
}

export default LayoutGroup
