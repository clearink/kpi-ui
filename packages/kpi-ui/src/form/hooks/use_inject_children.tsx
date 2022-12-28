import { useCallback, useMemo } from 'react'
import { Field as InternalFormField } from '../../_internal/components/form'
import { isRequired } from '../../_internal/utils/form_schema'
import { normalizeItemChildren } from '../utils/children'
import { isUndefined, omit, pick, toArray } from '../../_internal/utils'
import { useDebounceState } from '../../_internal/hooks'
import { FormContext } from '../../_internal/context'
import isInvalidUsage from '../utils/usage'

import type { FormItemProps, ValidateStatus } from '../props'
import type { FieldMeta } from '../../_internal/components/form/internal_props'

function makeEmptyMeta(): FieldMeta {
  return {
    name: [],
    dirty: false,
    touched: false,
    validating: false,
    errors: [],
    warnings: [],
  }
}
// 向 Form.Item 包裹的组件内部 注入数据
export default function useInjectChildren(props: FormItemProps, formItemId?: string) {
  const { form: formInstance } = FormContext.useState()

  const { validateStatus, name, rule } = props

  const invalidUsage = isInvalidUsage(props)

  const children = useMemo(() => {
    // 用法不合法将不返回任何东西
    if (invalidUsage) return () => undefined

    return normalizeItemChildren(props.children, formInstance!, formItemId)
  }, [invalidUsage, formInstance, formItemId, props.children])

  // if (isValidElement(children)) {
  //   // TODO: 检测是否支持 ref 获取 dom 用于实现 scrollToField
  // }

  const [meta, setMeta] = useDebounceState(10, makeEmptyMeta)

  const handleMetaChange = useCallback(
    (fieldMeta: FieldMeta) => {
      const next = fieldMeta as FieldMeta & { mounted: boolean }

      setMeta(omit(next, ['mounted']))

      // if(noStyle) // 通知到上层组件
    },
    [setMeta]
  )

  const errorInfo = useMemo(() => {
    const metaInfo = pick(meta, ['errors', 'warnings'])

    let status: ValidateStatus = ''

    if (!isUndefined(validateStatus)) status = validateStatus
    else if (meta.validating) status = 'validating'
    else if (meta.errors.length) status = 'error'
    else if (meta.warnings.length) status = 'warning'
    else if (meta.touched) status = 'success'

    return { ...metaInfo, validateStatus: status }
  }, [meta, validateStatus])

  const isRequiredItem = useMemo(() => {
    if (!toArray(name).length) return false
    return isRequired(rule)
  }, [name, rule])

  return [
    <InternalFormField {...props} onMetaChange={handleMetaChange}>
      {children}
    </InternalFormField>,
    errorInfo,
    isRequiredItem,
  ] as const
}
