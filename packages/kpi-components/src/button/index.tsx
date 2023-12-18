import { withDefaults, withoutProperties } from '@kpi-ui/utils'
import { ForwardedRef, forwardRef, type MouseEvent, useMemo } from 'react'
import { usePrefixCls } from '../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
import Wave from '../animation/wave'

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

  const disabledWave = variant === 'link' || variant === 'text' || !!loading

  return (
    <Wave disabled={disabledWave}>
      <button {...attrs} className={classes} ref={ref} onClick={handleClick}>
        <span>{children}</span>
      </button>
    </Wave>
  )
}

export default withDefaults(forwardRef(Button), {
  theme: 'primary',
  variant: 'default',
  type: 'button',
})
