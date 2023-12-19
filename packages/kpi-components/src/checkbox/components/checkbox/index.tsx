import { useControllableState } from '@kpi-ui/hooks'
import { fallback, isNullish, withDefaults, withoutProperties } from '@kpi-ui/utils'
import { usePrefixCls } from '../../../_shared/hooks'
import TouchEffect from '../../../touch-effect'
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

function Checkbox(props: CheckboxProps) {
  const { children } = props

  const prefixCls = usePrefixCls('checkbox')

  const [checked, setChecked] = useControllableState({
    value: props.checked,
    defaultValue: props.defaultChecked,
    onChange: props.onChange,
  })

  // TODO
  // CheckboxGroupContext.disabled props.disabled ConfigContextDisabled

  // const disabled = fallback()

  const classes = useFormatClass(prefixCls, props, { checked })

  const attrs = withoutProperties(props, excluded)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
  }

  return (
    <TouchEffect component="Checkbox" disabled={checked} selector={`.${prefixCls}__input`}>
      <label {...attrs} className={classes}>
        <input
          className={`${prefixCls}__original`}
          checked={!!checked}
          type="checkbox"
          onChange={handleChange}
        />
        <span className={`${prefixCls}__input`}></span>
        {!isNullish(children) && <span className={`${prefixCls}__label`}>{children}</span>}
      </label>
    </TouchEffect>
  )
}

export default withDefaults(Checkbox)
