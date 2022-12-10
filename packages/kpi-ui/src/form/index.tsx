// 二次封装 _internal/components/form
import InternalForm from './components/form'
import FormItem from './components/form_item'
import useForm from './hooks/use_form'

type CompoundedComponent = typeof InternalForm & {
  Item: typeof FormItem
  useForm: typeof useForm
}

const Form = InternalForm as CompoundedComponent
Form.Item = FormItem
Form.useForm = useForm
export default Form
