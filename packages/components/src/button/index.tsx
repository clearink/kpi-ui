import { omit, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { DisabledContext, SizeContext } from '_shared/contexts'
import { usePrefixCls, useSemanticStyles } from '_shared/hooks'
import { type ForwardedRef, type MouseEvent, forwardRef } from 'react'

import type { ButtonProps } from './props'

import TouchEffect from '../touch-effect'
import useFormatClass from './hooks/use_format_class'
import { isBorderedVariant } from './utils/helpers'

const excluded = [
  'theme',
  'variant',
  'shape',
  'size',
  'loading',
  'block',
  'ghost',
  'icon',
  'onClick',
  // 子元素
  'children',
  // 样式
  'className',
  'classNames',
  'style',
  'styles',
] as const

const defaultProps: Partial<ButtonProps> = {
  theme: 'primary',
  type: 'button',
  variant: 'default',
}

function Button(_props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  const props = withDefaults(
    { ..._props, disabled: _props.disabled },
    // disabled: _props.disabled || ButtonGroupCtx.disabled
    {
      ...defaultProps,
      disabled: DisabledContext.useState(),
      size: SizeContext.useState(),
    },
  )

  const { children, disabled, loading, onClick, style, styles: _styles, variant } = props

  const styles = useSemanticStyles(style, _styles)

  const prefixCls = usePrefixCls('button')

  const classNames = useFormatClass(prefixCls, props)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) e.preventDefault()
    else onClick?.(e)
  }

  const attrs = omit(props, excluded)

  const renderNode = (
    <button
      {...attrs}
      className={classNames.root}
      onClick={handleClick}
      ref={ref}
      style={styles.root}
    >
      <span className={classNames.text} style={styles.text}>
        {children}
      </span>
    </button>
  )

  if (!isBorderedVariant(variant)) return renderNode

  return (
    <TouchEffect component="Button" disabled={!!loading}>
      {renderNode}
    </TouchEffect>
  )
}

export default withDisplayName(forwardRef(Button), 'Button')
