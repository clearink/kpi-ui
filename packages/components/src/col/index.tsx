import { omit } from '@kpi-ui/utils'
import { RowContext } from '_shared/contexts'
import { usePrefixCls } from '_shared/hooks'
import { BREAKPOINT_NAME } from '_shared/hooks/use-breakpoint/breakpoint'
import { type ForwardedRef, forwardRef } from 'react'

import type { ColProps } from './props'

import useColFlex from './hooks/use_col_flex'
import useFormatClass from './hooks/use_format_class'

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
