import InternalForm from './components/form'
import Field from './components/form_field'
import List from './components/form_list'
import useForm from './hooks/use_form'
import useWatch from './hooks/use_watch'

type InternalFormType = typeof InternalForm
interface FormType extends InternalFormType {
  Field: typeof Field
  List: typeof List
  useForm: typeof useForm
  useWatch: typeof useWatch
}
const Form = InternalForm as FormType
Form.Field = Field
Form.List = List
Form.useForm = useForm
Form.useWatch = useWatch

export default Form

export { useForm, List, Field, useWatch }
