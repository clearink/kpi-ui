import { withDefaults } from '@kpi/internal'
import { isNumber, isUndefined, omit, useConstant } from '@kpi/shared'
import { CSSProperties, forwardRef, useMemo, type ForwardedRef } from 'react'
import { BREAKPOINT_NAME, COL_FLEX_REG } from '../_internal/constant'
import { RowContext } from '../_internal/context'
import { usePrefixCls } from '../_internal/hooks'
import { detectFlexGap } from '../_internal/utils'
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

  const gapSupport = useConstant(detectFlexGap)

  const { hGutter, vGutter } = RowContext.useState()

  const gapStyle = useMemo(() => {
    const [h, v] = [hGutter / 2, vGutter / 2]

    const style: CSSProperties = {}

    if (h) {
      gapStyle.paddingLeft = h
      gapStyle.paddingRight = h
    }

    if (v && !gapSupport) {
      gapStyle.paddingTop = v
      gapStyle.paddingBottom = v
    }

    return style
  }, [gapSupport, hGutter, vGutter])

  const flex = useMemo(() => {
    if (isUndefined($flex)) return undefined

    if (isNumber($flex)) return `${$flex} ${$flex} auto`

    if (COL_FLEX_REG.test($flex)) return `0 0 ${$flex}`
  }, [$flex])

  const attrs = omit(props, excluded)

  return (
    <div className={className} ref={ref} style={{ flex, ...gapStyle, ...$style }} {...attrs}>
      {children}
    </div>
  )
}

export default withDefaults(forwardRef(Col), {} as const)
