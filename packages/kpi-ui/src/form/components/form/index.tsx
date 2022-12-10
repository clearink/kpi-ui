import type { ReactElement, Ref } from 'react'
import InternalForm from '../../../_internal/components/form'

import type { FormInstance, FormProps } from '../../props'

function Form(props: FormProps) {
  return <InternalForm {...props} />
}

export default Form as <State = any>(
  props: FormProps<State> & { ref?: Ref<FormInstance<State>> }
) => ReactElement
