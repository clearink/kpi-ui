import InternalForm from './components/form'
import InternalFormField from './components/form_field'

type InternalFormType = typeof InternalForm
interface FormType extends InternalFormType {
  Field: typeof InternalFormField
}
const Form = InternalForm as FormType
Form.Field = InternalFormField

export default Form
