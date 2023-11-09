import { List, useWatch } from '../form-internal'
import ErrorList from './components/error-list'
import Form from './components/form'
import useForm from './components/form/hooks/use_form'
import useFormInstance from './components/form/hooks/use_instance'
import FormItem from './components/item'
import useFormItemStatus from './components/item/hooks/use_item_status'

type CompoundedFormItemType = typeof FormItem & {
  useItemStatus: typeof useFormItemStatus
}

type CompoundedFormType = typeof Form & {
  Item: CompoundedFormItemType
  List: typeof List
  ErrorList: typeof ErrorList
  useForm: typeof useForm
  useFormInstance: typeof useFormInstance
  useWatch: typeof useWatch
}

const CompoundedForm = Form as CompoundedFormType

const CompoundedFormItem = FormItem as CompoundedFormItemType

CompoundedFormItem.useItemStatus = useFormItemStatus
CompoundedForm.Item = CompoundedFormItem
CompoundedForm.List = List
CompoundedForm.ErrorList = ErrorList
CompoundedForm.useForm = useForm
CompoundedForm.useFormInstance = useFormInstance
CompoundedForm.useWatch = useWatch

export default CompoundedForm
