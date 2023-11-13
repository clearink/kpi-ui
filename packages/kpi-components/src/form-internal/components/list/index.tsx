import { useConstant, useDeepMemo } from '@kpi-ui/hooks'
import { isArray, isFunction, isUndefined, logger, rawType, toArray } from '@kpi-ui/utils'
import { useMemo } from 'react'
import { InternalFormInstanceContext } from '../../_shared/context'
import { getIn } from '../../utils/value'
import InternalFormField from '../field'
import FormListControl from './control'

import type { InternalFormListProps } from './props'

export default function InternalFormList(props: InternalFormListProps) {
  const { name, rule, initialValue, preserve, children } = props

  logger(isUndefined(name), 'Form.List', 'Miss `name` prop.')

  const instance = InternalFormInstanceContext.useState()

  const listPath = useDeepMemo(() => {
    return toArray(instance.listPath).concat(toArray(name))
  }, [instance.listPath, name])

  const instanceContext = useMemo(() => ({ ...instance, listPath }), [instance, listPath])

  const control = useConstant(() => new FormListControl())

  control.setInternalFormListMisc(instance, listPath, rule)

  const helpers = useMemo(() => control.getFeatures(), [control])

  const invalidChildren = !isFunction(children)

  logger(invalidChildren, 'Form.List only accepts function as children.')

  if (invalidChildren) return null

  return (
    <InternalFormInstanceContext.Provider value={instanceContext}>
      <InternalFormField
        name={[]}
        rule={rule}
        initialValue={initialValue}
        preserve={preserve}
        shouldUpdate={(prev, next, type) => {
          const path = toArray(name)

          const prevList = getIn(prev, path)

          const nextList = getIn(next, path)

          // 用户主动触发的默认不更新 或者 setFieldValue
          if (type !== 'setFields' && type !== 'fieldEvent') return prevList !== nextList

          // 数据类型不同
          if (rawType(prevList) !== rawType(nextList)) return true

          return isArray(nextList) && prevList.length !== nextList.length
        }}
      >
        {({ value }: any, meta) => {
          const fields = toArray(value, true).map((_, index) => ({
            name: index,
            key: control.ensureFieldKey(index),
            isListField: true,
          }))

          if (!isArray(value)) logger(true, `'${listPath.join(' > ')}' is not an array`)

          return children(fields, helpers, meta)
        }}
      </InternalFormField>
    </InternalFormInstanceContext.Provider>
  )
}
