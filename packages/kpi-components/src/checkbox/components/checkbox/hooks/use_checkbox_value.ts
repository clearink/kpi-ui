import { useControllableState } from '@kpi-ui/hooks'
// types
import type { CheckboxProps } from '../props'

export default function useCheckboxValue(props: CheckboxProps) {
  const { checked, defaultChecked, onChange } = props

  return useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onChange,
  })
}
