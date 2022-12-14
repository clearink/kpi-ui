import { FormContext } from '../../_internal/context'

export default function useFormInstance() {
  const { form } = FormContext.useState()
  return form!
}
