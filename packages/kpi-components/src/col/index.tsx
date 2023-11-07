import { isNumber, isUndefined, withoutProperties } from '@kpi-ui/utils'
import { forwardRef, useMemo, type ForwardedRef } from 'react'
import { BREAKPOINT_NAME, COL_FLEX_REG } from '../_internal/constant'
import { RowContext } from '../_internal/context'
import { usePrefixCls } from '../_internal/hooks'
import { withDefaults } from '../_internal/utils'
import useClass from './hooks/use_class'

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
  const { children, style: $style, flex: $flex } = props

  const name = usePrefixCls('col')

  const className = useClass(name, props)

  const hGutter = RowContext.useState()

  const gapStyle = useMemo(() => {
    const h = hGutter / 2

    return h ? { paddingLeft: h, paddingRight: h } : {}
  }, [hGutter])

  const flex = useMemo(() => {
    if (isUndefined($flex)) return undefined

    if (isNumber($flex)) return `${$flex} ${$flex} auto`

    if (COL_FLEX_REG.test($flex)) return `0 0 ${$flex}`
  }, [$flex])

  const attrs = withoutProperties(props, excluded)

  return (
    <div className={className} ref={ref} style={{ flex, ...gapStyle, ...$style }} {...attrs}>
      {children}
    </div>
  )
}

export default withDefaults(forwardRef(Col), {} as const)
