// 二次封装 _internal/components/form
import InternalForm from './components/form'
import FormItem from './components/form_item'
import useForm from './hooks/use_form'
import useFormInstance from './hooks/use_instance'

type CompoundedComponent = typeof InternalForm & {
  Item: typeof FormItem
  useForm: typeof useForm
  useFormInstance: typeof useFormInstance
}

const Form = InternalForm as CompoundedComponent
Form.Item = FormItem
Form.useForm = useForm
Form.useFormInstance = useFormInstance
export default Form
