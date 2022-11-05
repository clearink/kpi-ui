import isEqual from 'react-fast-compare'
import type { MutableRefObject } from 'react'
import BaseControl from './base_control'
import { isFunction, isNullish, isObjectLike } from '../../_utils'
import { BaseSchema } from '../../_utils/form_schema/schema'
import { getIn } from '../utils/value'

import type {
  UpdateFieldActionType as ActionType,
  InternalFormFieldProps,
  FieldMeta,
  InternalNamePath,
} from '../internal_props'
import type { SchemaIssue } from '../../_utils/form_schema/interface'

export default class FormFieldControl extends BaseControl {
  _key: string // 唯一标识

  constructor(
    public _name: InternalNamePath, // 记录 name
    _forceUpdate: () => void,
    mounted: MutableRefObject<boolean>
  ) {
    super(_forceUpdate, mounted)
    this._key = FormFieldControl._getName(_name)
  }

  // 生成 DOM 唯一标识
  _getId(parentName?: string) {
    return [parentName, ...this._name].filter((item) => item !== undefined).join('_')
  }

  // 是否应该更新自己
  shouldUpdate(prev: any, next: any, type: ActionType) {
    const {
      _key: key,
      _name: name,
      _props: { shouldUpdate: handler },
    } = this
    if (!handler && key) {
      return getIn(prev, name) !== getIn(next, name)
    }
    if (handler === true) return true

    return isFunction(handler) ? handler(prev, next, type) : false
  }

  _props: Partial<InternalFormFieldProps> = {}

  setFieldProps(props: Partial<InternalFormFieldProps>) {
    this._props = isObjectLike(props) ? props : {}
  }

  private _touched = false

  private _dirty = false

  private _pending = false

  private _errors: string[] = []

  getFieldMeta(): FieldMeta {
    return {
      dirty: this._dirty,
      touched: this._touched,
      pending: this._pending,
      errors: this._errors,
      warnings: [], // TODO: 后续加上
    }
  }

  setFieldMeta(meta: Partial<FieldMeta>) {
    // 自动触发 onMetaChange 事件
    const prev = this.getFieldMeta()
    // 同步全部
    !isNullish(meta.dirty) && (this._dirty = meta.dirty)
    !isNullish(meta.pending) && (this._pending = meta.pending)
    !isNullish(meta.touched) && (this._touched = meta.touched)
    !isNullish(meta.errors) && (this._errors = meta.errors)
    const current = this.getFieldMeta()
    if (!isEqual(prev, current)) this._props.onMetaChange?.(current)
  }

  // 字段级别校验
  async validate(value: any) {
    const { rule: validator } = this._props
    if (!(validator instanceof BaseSchema)) return
    try {
      this.setFieldMeta({ pending: true, touched: true })
      await validator.validate(value)
      this.setFieldMeta({ pending: false, errors: [] })
    } catch (error) {
      const { issues = [] } = error as { issues: SchemaIssue[] }
      const errors = issues.map((issue) => issue.message)
      this.setFieldMeta({ pending: false, errors })
    } finally {
      // TODO: 仅校验自身 ?
      this.forceUpdate()
    }
  }
}
