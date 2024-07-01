import { DisabledContext } from '_shared/contexts'
import { usePrefixCls } from '_shared/hooks'
import { isNullish, omit, withDefaults, withDisplayName } from '@kpi-ui/utils'

import { CheckboxGroupContext } from '@/checkbox/_shared/context'
import TouchEffect from '@/touch-effect'

import useCheckboxValue from './hooks/use_checkbox_value'
import useFormatClass from './hooks/use_format_class'
import type { CheckboxProps } from './props'

const excluded = [
  'autoFocus',
  'children',
  'disabled',
  'checked',
  'defaultChecked',
  'indeterminate',
  'onChange',
] as const

function Checkbox(_props: CheckboxProps) {
  const group = CheckboxGroupContext.useState()

  const props = withDefaults(
    {
      ..._props,
      disabled: _props.disabled || group.disabled,
    },
    {
      disabled: DisabledContext.useState(),
    }
  )

  const { disabled, children } = props

  const prefixCls = usePrefixCls('checkbox')

  const [checked, setChecked] = useCheckboxValue(props)

  const classes = useFormatClass(prefixCls, props, {
    checked,
    disabled,
  })

  const attrs = omit(props, excluded)

  return (
    <TouchEffect component="Checkbox" disabled={checked} selector={`.${prefixCls}__input`}>
      <label {...attrs} className={classes}>
        <input
          className={`${prefixCls}__original`}
          checked={!!checked}
          type="checkbox"
          onChange={(e) => {
            !disabled && setChecked(e.target.checked)
          }}
        />
        <span className={`${prefixCls}__input`}></span>
        {!isNullish(children) && <span className={`${prefixCls}__label`}>{children}</span>}
      </label>
    </TouchEffect>
  )
}

export default withDisplayName(Checkbox)
