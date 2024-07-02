import Field from './components/field'
import InternalForm from './components/form'
import useForm from './components/form/hooks/use_form'
import useWatch from './components/form/hooks/use_watch'
import List from './components/list'
import Provider from './components/provider'

const Form = Object.assign(InternalForm, {
  Field,
  List,
  Provider,
  useForm,
  useWatch,
})

export { Field, Form, List, Provider, useForm, useWatch }

export default Form
