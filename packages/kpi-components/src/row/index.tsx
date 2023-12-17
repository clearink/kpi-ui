import { withDefaults, withoutProperties } from '@kpi-ui/utils'
import { CSSProperties, forwardRef, type ForwardedRef } from 'react'
import { RowContext } from '../_shared/context'
import { usePrefixCls } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
import useRowGutter from './hooks/use_row_gutter'

import type { RowProps } from './props'

const excluded = ['children', 'gutter', 'align', 'justify', 'wrap'] as const

function Row(props: RowProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, style, gutter } = props

  const prefixCls = usePrefixCls('row')

  const classes = useFormatClass(prefixCls, props)

  const [hGutter, vGutter] = useRowGutter(gutter!)

  const [h, v] = [hGutter / -2, vGutter / -2]

  const gap: CSSProperties = {}

  if (h) gap.marginLeft = h

  if (h) gap.marginRight = h

  if (v) gap.rowGap = vGutter

  const attrs = withoutProperties(props, excluded)

  return (
    <div {...attrs} className={classes} ref={ref} style={{ ...gap, ...style }}>
      <RowContext.Provider value={hGutter}>{children}</RowContext.Provider>
    </div>
  )
}

export default withDefaults(forwardRef(Row), {
  gutter: 0,
  wrap: true,
})
