import { withoutProperties } from '@kpi-ui/utils'
import { forwardRef, type ForwardedRef } from 'react'
import { BREAKPOINT_NAME } from '../_internal/constants'
import { usePrefixCls } from '../_internal/hooks'
import { withDefaults } from '../_internal/utils'
import { RowContext } from '../_shared/context'
import useColFlex from './hooks/use_col_flex'
import useFormatClass from './hooks/use_format_class'

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
  const { children, style } = props

  const name = usePrefixCls('col')

  const classes = useFormatClass(name, props)

  const gutter = RowContext.useState() / 2

  const gapStyle = gutter ? { paddingLeft: gutter, paddingRight: gutter } : undefined

  const flex = useColFlex(props.flex)

  const attrs = withoutProperties(props, excluded)

  return (
    <div className={classes} ref={ref} style={{ flex, ...gapStyle, ...style }} {...attrs}>
      {children}
    </div>
  )
}

export default withDefaults(forwardRef(Col))
