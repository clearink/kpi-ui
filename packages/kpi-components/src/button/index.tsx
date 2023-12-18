import { withDefaults, withoutProperties } from '@kpi-ui/utils'
import { ForwardedRef, forwardRef, type MouseEvent } from 'react'
import { usePrefixCls } from '../_shared/hooks'
import TouchEffect from '../touch-effect'
import useFormatClass from './hooks/use_format_class'
import { isBorderedVariant } from './utils/helpers'

import type { ButtonProps } from './props'

const excluded = [
  'theme',
  'variant',
  'shape',
  'size',
  'loading',
  'block',
  'ghost',
  'icon',
  'children',
] as const

function Button(props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  const { children, onClick, loading, disabled, variant } = props

  const prefixCls = usePrefixCls('button')

  const classes = useFormatClass(prefixCls, props)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) e.preventDefault()
    else onClick && onClick(e)
  }

  const attrs = withoutProperties(props, excluded)

  const renderNode = (
    <button {...attrs} className={classes} ref={ref} onClick={handleClick}>
      <span>{children}</span>
    </button>
  )

  if (!isBorderedVariant(variant)) return renderNode

  return <TouchEffect disabled={!!loading}>{renderNode}</TouchEffect>
}

export default withDefaults(forwardRef(Button), {
  theme: 'primary',
  variant: 'default',
  type: 'button',
})
