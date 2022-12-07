import { CSSProperties, useMemo } from 'react'
import { RowContext } from '@context'
import { BREAKPOINT_NAME, COL_FLEX_REG } from '@constant'
import { isNumber, omit } from '@utils'
import { withDefaultProps } from '@hocs'
import useClass from './hooks/use_class'
import { ColProps } from './props'

function Col(props: ColProps) {
  const { children, span, style: $style, flex: $flex, ...rest } = props

  const className = useClass(props)
  const attrs = omit(rest, ['className', 'offset', 'order', 'pull', 'push', ...BREAKPOINT_NAME])

  const { gapSupport, hGutter, vGutter } = RowContext.useState()

  const gapStyle = useMemo(() => {
    const [h, v] = [hGutter / 2, vGutter / 2]
    const style: CSSProperties = {}
    if (h) Object.assign(style, { paddingLeft: h, paddingRight: h })
    if (v && !gapSupport) Object.assign(style, { paddingTop: v, paddingBottom: v })
    return style
  }, [gapSupport, hGutter, vGutter])

  const style = useMemo(() => {
    let flex = $flex
    if (!flex) flex = $flex
    else if (isNumber(flex)) flex = `${flex} ${flex} auto`
    else if (COL_FLEX_REG.test(flex)) flex = `0 0 ${flex}`
    return { ...gapStyle, flex, ...$style }
  }, [$style, $flex, gapStyle])

  return (
    <div className={className} style={style} {...attrs}>
      {children}
    </div>
  )
}

export default withDefaultProps(Col, {})
