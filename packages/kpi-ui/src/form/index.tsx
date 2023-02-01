// // 二次封装 _internal/components/form
import { Form as InternalForm } from '@kpi/internal'
import $Form from './components/form'
import ErrorList from './components/error-list'
import FormItem from './components/form-item'
import FormList from './components/form-list'
import useForm from './hooks/use_form'
import useFormInstance from './hooks/use_instance'

type CompoundedComponent = typeof $Form & {
  Item: typeof FormItem
  List: typeof FormList
  ErrorList: typeof ErrorList
  useForm: typeof useForm
  useFormInstance: typeof useFormInstance
  useWatch: typeof InternalForm.useWatch
}

const Form = $Form as CompoundedComponent

Form.Item = FormItem
Form.List = FormList
Form.ErrorList = ErrorList
Form.useForm = useForm
Form.useFormInstance = useFormInstance
Form.useWatch = InternalForm.useWatch

export default Form
