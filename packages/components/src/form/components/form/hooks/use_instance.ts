import { FormContext } from '@/form/_shared/context'

export default function useFormInstance() {
  return FormContext.useState().form
}
