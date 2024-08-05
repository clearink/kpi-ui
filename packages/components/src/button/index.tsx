import { styledAttrs } from '@comps/_shared/constants'
import { DisabledContext, SizeContext } from '@comps/_shared/contexts'
import { usePrefixCls, useSemanticStyles } from '@comps/_shared/hooks'
import { attachDisplayName, withDefaults } from '@comps/_shared/utils'
import { omit } from '@internal/utils'
import { type ForwardedRef, type MouseEvent, forwardRef } from 'react'

import type { ButtonProps } from './props'

import TouchEffect from '../touch-effect'
import { ButtonGroupContext } from './_shared/context'
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
  ...styledAttrs,
] as const

const defaultProps: Partial<ButtonProps> = {
  theme: 'primary',
  type: 'button',
  variant: 'outlined',
}

function _Button(_props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  const buttonGroupCtx = ButtonGroupContext.useState()

  const props = withDefaults(
    {
      ..._props,
      disabled: _props.disabled || buttonGroupCtx.disabled,
    },
    {
      ...defaultProps,
      disabled: DisabledContext.useState(),
      size: SizeContext.useState(),
    },
  )

  const { children, disabled, loading, onClick, variant } = props

  const styles = useSemanticStyles(props)

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
      ref={ref}
      className={classNames.root}
      style={styles.root}
      onClick={handleClick}
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

attachDisplayName(_Button)

const Button = forwardRef(_Button)

export default Button
