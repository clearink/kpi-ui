import Field from './components/field'
import InternalForm from './components/form'
import useForm from './components/form/hooks/use_form'
import useWatch from './components/form/hooks/use_watch'
import List from './components/list'
import Provider from './components/provider'

const Form = Object.assign(InternalForm, {
  Field: Field,
  List: List,
  useForm: useForm,
  useWatch: useWatch,
  Provider: Provider,
})

export { Form, Field, List, Provider, useForm, useWatch }

export default Form
