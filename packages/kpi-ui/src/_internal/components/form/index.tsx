import InternalForm from './components/form'
import InternalFormField from './components/form_field'
import List from './components/form_list'
import useForm from './hooks/use_form'

type InternalFormType = typeof InternalForm
interface FormType extends InternalFormType {
  Field: typeof InternalFormField
  List: typeof List
  useForm: typeof useForm
}
const Form = InternalForm as FormType
Form.Field = InternalFormField
Form.List = List
Form.useForm = useForm

export default Form
