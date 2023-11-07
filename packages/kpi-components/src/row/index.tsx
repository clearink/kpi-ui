import { withoutProperties } from '@kpi-ui/utils'
import { CSSProperties, forwardRef, type ForwardedRef } from 'react'
import { usePrefixCls } from '../_internal/hooks'
import { withDefaults } from '../_internal/utils'
import { RowContext } from '../_shared/context'
import useFormatClass from './hooks/use_format_class'
import useRowGutter from './hooks/use_row_gutter'

import type { RowProps } from './props'

const excluded = ['children', 'style', 'gutter', 'align', 'justify', 'wrap', 'className'] as const

function Row(props: RowProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, style, gutter } = props

  const name = usePrefixCls('row')

  const classes = useFormatClass(name, props)

  const [hGutter, vGutter] = useRowGutter(gutter)

  const [h, v] = [hGutter / -2, vGutter / -2]

  const gap: CSSProperties = {}

  if (h) gap.marginLeft = h

  if (h) gap.marginRight = h

  if (v) gap.rowGap = vGutter

  const attrs = withoutProperties(props, excluded)

  return (
    <div className={classes} ref={ref} {...attrs} style={{ ...gap, ...style }}>
      <RowContext.Provider value={hGutter}>{children}</RowContext.Provider>
    </div>
  )
}

export default withDefaults(forwardRef(Row), {
  gutter: 0,
  wrap: true,
} as const)
