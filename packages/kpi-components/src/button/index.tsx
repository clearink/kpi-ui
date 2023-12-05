import { pickWithFallback, withDefaults, withoutProperties } from '@kpi-ui/utils'
import { ForwardedRef, forwardRef, useImperativeHandle, type MouseEvent } from 'react'
import { SizeContext } from '../_shared/context'
import { usePrefixCls } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
import useWave from './hooks/use-wave'

import type { ButtonProps } from './props'

const excluded = [
  'children',
  'htmlType',
  'onClick',
  'loading',
  'type',
  'block',
  'danger',
  'shape',
  'size',
  'ghost',
] as const

function Button(props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  const { children, htmlType, onClick, loading, disabled } = props

  const fallbacks = pickWithFallback(props, { size: SizeContext.useState() }, ['size'])

  const prefixCls = usePrefixCls('button')

  const classes = useFormatClass(prefixCls, props, fallbacks)

  const internalRef = useWave<HTMLButtonElement>()

  useImperativeHandle(ref, () => internalRef.current!)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) e.preventDefault()
    else onClick && onClick(e)
  }

  const attrs = withoutProperties(props, excluded)

  return (
    <button className={classes} ref={internalRef} type={htmlType} onClick={handleClick} {...attrs}>
      <span>{children}</span>
      {/* <Wave when={shouldRunWave} /> */}
    </button>
  )
}

export default withDefaults(forwardRef(Button), {
  htmlType: 'button',
  type: 'default',
})
