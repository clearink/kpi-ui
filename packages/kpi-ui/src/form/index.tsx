// 二次封装 _internal/components/form
import { useWatch } from '@kpi/internal/lib/form'
import InternalForm from './components/form'
import ErrorList from './components/error_list'
import FormItem from './components/form_item'
import FormList from './components/form_list'
import useForm from './hooks/use_form'
import useFormInstance from './hooks/use_instance'

type CompoundedComponent = typeof InternalForm & {
  Item: typeof FormItem
  List: typeof FormList
  ErrorList: typeof ErrorList
  useForm: typeof useForm
  useFormInstance: typeof useFormInstance
  useWatch: typeof useWatch
}

const Form = InternalForm as CompoundedComponent

Form.Item = FormItem
Form.List = FormList
Form.ErrorList = ErrorList
Form.useForm = useForm
Form.useFormInstance = useFormInstance
Form.useWatch = useWatch

export default Form
