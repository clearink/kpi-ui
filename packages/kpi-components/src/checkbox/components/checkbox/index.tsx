import { isFunction, withDefaults, withoutProperties } from '@kpi-ui/utils'
import { usePrefixCls } from '../../../_shared/hooks'
import useFormatClass from './hooks/use_format_class'

import type { CheckboxProps } from './props'
import { useControllableState } from '@kpi-ui/hooks'

const excluded = [
  'autoFocus',
  'children',
  'disabled',
  'checked',
  'defaultChecked',
  'indeterminate',
  'onChange',
] as const

function Checkbox(props: CheckboxProps) {
  const { children } = props

  const prefixCls = usePrefixCls('checkbox')

  const [checked, setChecked] = useControllableState({
    value: props.checked,
    defaultValue: props.defaultChecked,
    onChange: props.onChange,
  })

  const classes = useFormatClass(prefixCls, props, { checked })

  const attrs = withoutProperties(props, excluded)

  return (
    <label {...attrs} className={classes}>
      <span className={`${prefixCls}__input`}>
        <input
          className={`${prefixCls}__original`}
          checked={checked}
          type="checkbox"
          onChange={(e) => {
            setChecked(e.target.checked)
          }}
        />
        <span className={`${prefixCls}__inner`}></span>
      </span>
      <span className={`${prefixCls}__label`}>{children}</span>
    </label>
  )
}

export default withDefaults(Checkbox)
