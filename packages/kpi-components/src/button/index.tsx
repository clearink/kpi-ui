/* eslint-disable react/button-has-type */
import { withDefaults, withoutProperties } from '@kpi-ui/utils'
import { ForwardedRef, forwardRef, useImperativeHandle, type MouseEvent, useRef } from 'react'
import { usePrefixCls } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'

import type { ButtonProps } from './props'
import Wave from '../animation/wave'

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

  const name = usePrefixCls('button')

  const classes = useFormatClass(name, props)

  useImperativeHandle(ref, () => internalRef.current!)

  const internalRef = useRef<HTMLButtonElement>(null)

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
} as const)
