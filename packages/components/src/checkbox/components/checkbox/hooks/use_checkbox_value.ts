import { useControllableState } from '_shared/hooks'

import type { CheckboxProps } from '../props'

export default function useCheckboxValue(props: CheckboxProps) {
  const { checked, defaultChecked, onChange } = props

  return useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onChange,
  })
}
