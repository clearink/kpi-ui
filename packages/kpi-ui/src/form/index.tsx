import InternalForm from './components/form'
import InternalFormField from './components/form_field'
import List from './components/form_list'

type InternalFormType = typeof InternalForm
interface FormType extends InternalFormType {
  Field: typeof InternalFormField
  List: typeof List
}
const Form = InternalForm as FormType
Form.Field = InternalFormField
Form.List = List

export default Form
