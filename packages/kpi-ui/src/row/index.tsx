import { CSSProperties, useMemo } from 'react'
import { RowContext } from '../_context'
import { useFlexGapSupport, usePrefix } from '../_hooks'
import { omit, withDefault } from '../_utils'
import useRowClass from './hooks/use_row_class'
import useRowGutter from './hooks/use_row_gutter'
import { RowProps } from './props'

function Row(props: RowProps) {
  const { children, style: $style, gutter, ...rest } = props
  const name = usePrefix('row')
  const className = useRowClass(name, props)
  const gapSupport = useFlexGapSupport()
  const [hGutter, vGutter] = useRowGutter(gutter)
  const attrs = omit(rest, ['align', 'justify', 'wrap'])

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
    <div className={className} style={style} {...attrs}>
      <RowContext.Provider value={contextState}>{children}</RowContext.Provider>
    </div>
  )
}

export default withDefault(Row, {
  gutter: 0,
  wrap: true,
} as const)
