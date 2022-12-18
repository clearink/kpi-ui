import { memo, useMemo } from 'react'
import { List as InternalFormList } from '../../../_internal/components/form'
import { FormErrorListContext } from '../../../_internal/context'
import { usePrefixCls } from '../../../_internal/hooks'
import { logger, pick } from '../../../_internal/utils'

import type { FormListProps } from '../../props'

function FormList(props: FormListProps) {
  const { children, name } = props

  const prefixCls = usePrefixCls('form-item')

  const formErrorListContext = useMemo(() => ({ prefixCls }), [prefixCls])

  logger.error(!name, 'Form.List', 'Miss `name` prop.')

  return (
    <InternalFormList {...props}>
      {(fields, arrayHelpers, meta) => (
        <FormErrorListContext.Provider value={formErrorListContext}>
          {children(fields, arrayHelpers, pick(meta, ['errors', 'warnings']))}
        </FormErrorListContext.Provider>
      )}
    </InternalFormList>
  )
}

export default memo(FormList)
