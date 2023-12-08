import { withDefaults, withoutProperties } from '@kpi-ui/utils'
import { ForwardedRef, forwardRef, useImperativeHandle, type MouseEvent } from 'react'
import { usePrefixCls } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
import useWave from './hooks/use-wave'

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
  const { children, onClick, loading, disabled } = props

  const prefixCls = usePrefixCls('button')

  const classes = useFormatClass(prefixCls, props)

  const internalRef = useWave<HTMLButtonElement>()

  useImperativeHandle(ref, () => internalRef.current!)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) e.preventDefault()
    else onClick && onClick(e)
  }

  const attrs = withoutProperties(props, excluded)

  return (
    <button {...attrs} className={classes} ref={internalRef} onClick={handleClick}>
      <span>{children}</span>
      {/* <Wave when={shouldRunWave} /> */}
    </button>
  )
}

export default withDefaults(forwardRef(Button), {
  theme: 'default',
  variant: 'default',
  type: 'button',
})
