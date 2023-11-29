import { useEvent } from '@kpi-ui/hooks'
import { isNullish, withoutProperties } from '@kpi-ui/utils'
import { createElement, useMemo } from 'react'
import { LayoutContext, type LayoutContextState } from '../_shared/context'

import type { LayoutGroupProps } from './props'

const excluded = ['tag', 'children', 'onEnter', 'onEntering', 'onEntered'] as const

function LayoutGroup(props: LayoutGroupProps) {
  const {
    tag,
    children: _children,
    onEnter: _onEnter,
    onEntering: _onEntering,
    onEntered: _onEntered,
  } = props

  const onEnter = useEvent((params) => _onEnter && _onEnter(params))

  const onEntering = useEvent((el) => _onEntering && _onEntering(el))

  const onEntered = useEvent((el) => _onEntered && _onEntered(el))

  const layoutContext = useMemo<LayoutContextState>(() => {
    return { states: new Map(), onEnter, onEntering, onEntered }
  }, [onEntering, onEnter, onEntered])

  const children = (
    <LayoutContext.Provider value={layoutContext}>{_children}</LayoutContext.Provider>
  )

  if (isNullish(tag)) return children

  const attrs = withoutProperties(props, excluded)

  return createElement(tag as any, attrs, children)
}

export default LayoutGroup
