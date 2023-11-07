import { withoutProperties } from '@kpi-ui/utils'
import { CSSProperties, forwardRef, useMemo, type ForwardedRef } from 'react'
import { RowContext } from '../_internal/context'
import { usePrefixCls } from '../_internal/hooks'
import { withDefaults } from '../_internal/utils'
import useClass from './hooks/use_class'
import useRowGutter from './hooks/use_row_gutter'

import type { RowProps } from './props'

const excluded = ['children', 'style', 'gutter', 'align', 'justify', 'wrap', 'className'] as const

function Row(props: RowProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, style: $style, gutter } = props

  const name = usePrefixCls('row')

  const className = useClass(name, props)

  const [hGutter, vGutter] = useRowGutter(gutter)

  const gapStyle = useMemo(() => {
    const [h, v] = [hGutter / -2, vGutter / -2]

    const style: CSSProperties = {}

    if (h) {
      style.marginLeft = h
      style.marginRight = h
    }

    if (v) {
      style.marginLeft = h
      style.marginRight = h
      style.rowGap = vGutter
    }

    return style
  }, [hGutter, vGutter])

  const attrs = withoutProperties(props, excluded)

  return (
    <div className={className} ref={ref} {...attrs} style={{ ...gapStyle, ...$style }}>
      <RowContext.Provider value={hGutter}>{children}</RowContext.Provider>
    </div>
  )
}

export default withDefaults(forwardRef(Row), {
  gutter: 0,
  wrap: true,
} as const)
