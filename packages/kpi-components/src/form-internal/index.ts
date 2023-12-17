import Field from './components/field'
import InternalForm from './components/form'
import useForm from './components/form/hooks/use_form'
import useWatch from './components/form/hooks/use_watch'
import List from './components/list'
import Provider from './components/provider'

type CompoundedFormType = typeof InternalForm & {
  Field: typeof Field
  List: typeof List
  useForm: typeof useForm
  useWatch: typeof useWatch
  Provider: typeof Provider
}

const Form = InternalForm as CompoundedFormType

Form.Field = Field

Form.List = List

Form.useForm = useForm

Form.useWatch = useWatch

export { Form, Field, List, Provider, useForm, useWatch }

export default Form
