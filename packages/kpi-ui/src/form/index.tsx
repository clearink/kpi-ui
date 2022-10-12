import InternalForm from './components/form'
import FormItem from './components/form_item'

type InternalFormType = typeof InternalForm
interface FormType extends InternalFormType {
  Item: typeof FormItem
}
const Form = InternalForm as FormType
Form.Item = FormItem

export default Form
