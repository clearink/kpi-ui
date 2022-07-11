import { useMemo } from 'react'
import { usePrefix } from '../_hooks'
import { BREAKPOINT_NAME, COL_FLEX_REG } from '../_shard/constant'
import { isNumber, omit, withDefault } from '../_utils'
import useColClass from './hooks/use_col_class'
import { ColProps } from './props'

function Col(props: ColProps) {
  const { children, span, style: $style, flex: $flex, ...rest } = props
  const name = usePrefix('col')
  const className = useColClass(name, props)
  const attrs = omit(rest, ['className', 'offset', 'order', 'pull', 'push', ...BREAKPOINT_NAME])

  const style = useMemo(() => {
    let flex = $flex
    if (!flex) flex = $flex
    else if (isNumber(flex)) flex = `${flex} ${flex} auto`
    else if (COL_FLEX_REG.test(flex)) flex = `0 0 ${flex}`
    return { flex, ...$style }
  }, [$style, $flex])
  return (
    <div className={className} style={style} {...attrs}>
      {children}
    </div>
  )
}

export default withDefault(Col, {})
