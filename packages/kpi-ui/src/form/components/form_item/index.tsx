import { FormFieldProps } from '../../props'
import InternalFormField from '../../../_internal/components/form/components/form_field'

export default function FormItem(props: FormFieldProps) {
  return (
    <div className="kpi-form-item">
      <label className="kpi-form-item__label">{props.label}</label>
      <div className="kpi-form-item__control">
        <InternalFormField name={props.name}>
          {(values, meta, formInstance) => {
            return 'form-filed'
          }}
        </InternalFormField>
      </div>
    </div>
  )
}
