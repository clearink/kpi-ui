import InternalForm from './_internal/components/form'
import Field from './_internal/components/field'
import List from './_internal/components/list'
import Provider from './_internal/components/provider'
import useForm from './_internal/components/form/hooks/use_form'
import useWatch from './_internal/components/form/hooks/use_watch'

type FormType = typeof InternalForm & {
  Field: typeof Field
  List: typeof List
  useForm: typeof useForm
  useWatch: typeof useWatch
  Provider: typeof Provider
}

const Form = InternalForm as FormType

Form.Field = Field

Form.List = List

Form.useForm = useForm

Form.useWatch = useWatch

export { useForm, List, Field, useWatch, Provider }

export default Form
