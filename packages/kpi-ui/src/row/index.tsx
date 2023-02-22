import { CSSProperties, forwardRef, useMemo, type ForwardedRef } from 'react'
import { omit } from '@kpi/shared'
import { withDefaultProps } from '@kpi/internal'
import { RowContext } from '../_internal/context'
import { useFlexGapSupport, usePrefixCls } from '../_internal/hooks'
import useClass from './hooks/use_class'
import useRowGutter from './hooks/use_row_gutter'
import { RowProps } from './props'

const excluded = ['children', 'style', 'gutter', 'align', 'justify', 'wrap', 'className'] as const

function Row(props: RowProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, style: $style, gutter } = props

  const name = usePrefixCls('row')

  const className = useClass(name, props)

  const gapSupport = useFlexGapSupport()

  const [hGutter, vGutter] = useRowGutter(gutter)

  const contextState = useMemo(() => {
    return { gapSupport, hGutter, vGutter }
  }, [gapSupport, hGutter, vGutter])

  const [h, v] = [hGutter / -2, vGutter / -2]

  const gapStyle: CSSProperties = {}

  if (h) {
    gapStyle.marginLeft = h
    gapStyle.marginRight = h
  }

  if (v && gapSupport) {
    gapStyle.marginLeft = h
    gapStyle.marginRight = h
    gapStyle.rowGap = vGutter
  } else if (v) {
    gapStyle.marginTop = v
    gapStyle.marginBottom = v
  }

  const attrs = omit(props, excluded)

  return (
    <div className={className} ref={ref} {...attrs} style={{ ...gapStyle, ...$style }}>
      <RowContext.Provider value={contextState}>{children}</RowContext.Provider>
    </div>
  )
}

export default withDefaultProps(forwardRef(Row), {
  gutter: 0,
  wrap: true,
} as const)
