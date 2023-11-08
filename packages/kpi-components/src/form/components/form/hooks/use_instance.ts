import { FormContext } from '../../../_shared/context'

export default function useFormInstance() {
  return FormContext.useState().form
}
