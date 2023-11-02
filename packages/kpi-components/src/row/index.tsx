import { withDefaults } from '@kpi-ui/internal'
import { useConstant } from '@kpi-ui/hooks'
import { omit } from '@kpi-ui/utils'
import { CSSProperties, forwardRef, useMemo, type ForwardedRef } from 'react'
import { RowContext } from '../_internal/context'
import { usePrefixCls } from '../_internal/hooks'
import { detectFlexGap } from '../_internal/utils'
import useClass from './hooks/use_class'
import useRowGutter from './hooks/use_row_gutter'

import type { RowProps } from './props'

const excluded = ['children', 'style', 'gutter', 'align', 'justify', 'wrap', 'className'] as const

function Row(props: RowProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, style: $style, gutter } = props

  const name = usePrefixCls('row')

  const className = useClass(name, props)

  const gapSupport = useConstant(detectFlexGap)

  const [hGutter, vGutter] = useRowGutter(gutter)

  const contextState = useMemo(() => ({ hGutter, vGutter }), [hGutter, vGutter])

  const gapStyle = useMemo(() => {
    const [h, v] = [hGutter / -2, vGutter / -2]

    const style: CSSProperties = {}

    if (h) {
      style.marginLeft = h
      style.marginRight = h
    }
    if (v && gapSupport) {
      style.marginLeft = h
      style.marginRight = h
      style.rowGap = vGutter
    } else if (v) {
      style.marginTop = v
      style.marginBottom = v
    }

    return style
  }, [gapSupport, hGutter, vGutter])

  const attrs = omit(props, excluded)

  return (
    <div className={className} ref={ref} {...attrs} style={{ ...gapStyle, ...$style }}>
      <RowContext.Provider value={contextState}>{children}</RowContext.Provider>
    </div>
  )
}

export default withDefaults(forwardRef(Row), {
  gutter: 0,
  wrap: true,
} as const)
