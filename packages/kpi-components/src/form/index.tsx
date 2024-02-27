import { List, useWatch } from '../_internal/form'
import ErrorList from './components/error-list'
import Form from './components/form'
import useForm from './components/form/hooks/use_form'
import useFormInstance from './components/form/hooks/use_instance'
import FormItem from './components/item'
import useFormItemStatus from './components/item/hooks/use_item_status'

// CompoundedForm
export default Object.assign(Form, {
  Item: Object.assign(FormItem, { useFormItemStatus }),
  List,
  ErrorList,
  useForm,
  useFormInstance,
  useWatch,
})
