import { useControllableState } from '@kpi-ui/hooks'
import { isNullish, withDisplayName, omit } from '@kpi-ui/utils'
import { usePrefixCls } from '../../../_shared/hooks'
import useFormatClass from './hooks/use_format_class'
// comps
import TouchEffect from '../../../_internal/touch-effect'
// types
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

export const defaultProps: Partial<CheckboxProps> = {}

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

  const attrs = omit(props, excluded)

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

export default withDisplayName(Checkbox)
