import { omit, withDefaults, withDisplayName } from '@kpi-ui/utils'
import { forwardRef, type ForwardedRef, type MouseEvent } from 'react'
import { DisabledContext, SizeContext } from '_contexts'
import { usePrefixCls, useSemanticStyles } from '_hooks'
import useFormatClass from './hooks/use_format_class'
import { isBorderedVariant } from './utils/helpers'
// comps
import TouchEffect from '../touch-effect'
// types
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
  variant: 'default',
  type: 'button',
}

function Button(_props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  const props = withDefaults(
    { ..._props, disabled: _props.disabled },
    // disabled: _props.disabled || ButtonGroupCtx.disabled
    {
      ...defaultProps,
      size: SizeContext.useState(),
      disabled: DisabledContext.useState(),
    }
  )

  const { children, onClick, loading, disabled, variant, style, styles: _styles } = props

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
      style={styles.root}
      ref={ref}
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

export default withDisplayName(forwardRef(Button), 'Button')
