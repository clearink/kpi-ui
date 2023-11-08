// 二次封装 form-internal 组件
import InternalForm from '../form-internal'
import $Form from './components/form'
import ErrorList from './components/error-list'
import FormItem from './components/item'
import FormList from './components/list'
import useForm from './components/form/hooks/use_form'
import useFormInstance from './components/form/hooks/use_instance'

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

// type CompoundedComponent = typeof InternalFormItem & {
//   useStatus: typeof useFormItemStatus
// }

// const FormItem = InternalFormItem as CompoundedComponent
// FormItem.useStatus = useFormItemStatus
