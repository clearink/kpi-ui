import { omit } from '@kpi-ui/utils'
import { forwardRef, type ForwardedRef } from 'react'
import { RowContext } from '../_shared/context'
import { usePrefixCls } from '../_shared/hooks'
import { BREAKPOINT_NAME } from '../_shared/hooks/use-breakpoint/breakpoint'
import useColFlex from './hooks/use_col_flex'
import useFormatClass from './hooks/use_format_class'

import type { ColProps } from './props'

const excluded = [
  'children',
  'style',
  'flex',
  'span',
  'offset',
  'order',
  'pull',
  'push',
  ...BREAKPOINT_NAME,
] as const

function Col(props: ColProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, style } = props

  const prefixCls = usePrefixCls('col')

  const classes = useFormatClass(prefixCls, props)

  const gutter = RowContext.useState() / 2

  const gapStyle = gutter ? { paddingLeft: gutter, paddingRight: gutter } : undefined

  const flex = useColFlex(props.flex)

  const attrs = omit(props, excluded)

  return (
    <div {...attrs} className={classes} ref={ref} style={{ flex, ...gapStyle, ...style }}>
      {children}
    </div>
  )
}

export default forwardRef(Col)
