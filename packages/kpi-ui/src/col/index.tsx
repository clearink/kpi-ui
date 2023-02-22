import { CSSProperties, forwardRef, type ForwardedRef } from 'react'
import { isNumber, isUndefined, omit } from '@kpi/shared'
import { withDefaultProps } from '@kpi/internal'
import useClass from './hooks/use_class'
import { usePrefixCls } from '../_internal/hooks'
import { RowContext } from '../_internal/context'
import { BREAKPOINT_NAME, COL_FLEX_REG } from '../_internal/constant'

import type { ColProps } from './props'

const excluded = [
  'children',
  'style',
  'flex',
  'className',
  'span',
  'offset',
  'order',
  'pull',
  'push',
  ...BREAKPOINT_NAME,
] as const

function Col(props: ColProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, style: $style, flex: $flex } = props

  const name = usePrefixCls('col')

  const className = useClass(name, props)

  const { gapSupport, hGutter, vGutter } = RowContext.useState()

  const [h, v] = [hGutter / 2, vGutter / 2]

  const gapStyle: CSSProperties = {}

  if (h) {
    gapStyle.paddingLeft = h
    gapStyle.paddingRight = h
  }

  if (v && !gapSupport) {
    gapStyle.paddingTop = v
    gapStyle.paddingBottom = v
  }

  let flex: CSSProperties['flex']

  if (isUndefined($flex)) flex = undefined
  else if (isNumber($flex)) flex = `${$flex} ${$flex} auto`
  else if (COL_FLEX_REG.test($flex)) flex = `0 0 ${$flex}`

  const attrs = omit(props, excluded)

  return (
    <div className={className} ref={ref} style={{ flex, ...gapStyle, ...$style }} {...attrs}>
      {children}
    </div>
  )
}

export default withDefaultProps(forwardRef(Col), {} as const)
