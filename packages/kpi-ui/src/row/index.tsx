import { CSSProperties, useMemo } from 'react'
import { omit } from '@kpi/shared'
import { withDefaultProps } from '@kpi/internal'
import { RowContext } from '../_internal/context'
import { useFlexGapSupport, usePrefixCls } from '../_internal/hooks'
import useClass from './hooks/use_class'
import useRowGutter from './hooks/use_row_gutter'
import { RowProps } from './props'

function Row(props: RowProps) {
  const { children, style: $style, gutter, ...rest } = props
  const name = usePrefixCls('row')
  const className = useClass(name, props)
  const gapSupport = useFlexGapSupport()
  const [hGutter, vGutter] = useRowGutter(gutter)
  const attrs = omit(rest, ['align', 'justify', 'wrap', 'className'])

  const style = useMemo(() => {
    const [h, v] = [hGutter / -2, vGutter / -2]
    const gapStyle: CSSProperties = {}
    if (h) Object.assign(gapStyle, { marginLeft: h, marginRight: h })
    if (v && gapSupport) Object.assign(gapStyle, { marginLeft: h, marginRight: h, rowGap: vGutter })
    else if (v) Object.assign(gapStyle, { marginTop: v, marginBottom: v })
    return { ...gapStyle, ...$style }
  }, [gapSupport, hGutter, vGutter, $style])

  const contextState = useMemo(() => {
    return { gapSupport, hGutter, vGutter }
  }, [gapSupport, hGutter, vGutter])

  return (
    <div {...attrs} className={className} style={style}>
      <RowContext.Provider value={contextState}>{children}</RowContext.Provider>
    </div>
  )
}

export default withDefaultProps(Row, {
  gutter: 0,
  wrap: true,
} as const)
