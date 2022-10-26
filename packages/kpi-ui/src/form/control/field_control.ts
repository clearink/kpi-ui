import isEqual from 'react-fast-compare'
import type { MutableRefObject } from 'react'
import BaseControl from './base_control'
import { isFunction, isNullish, isObjectLike, toArray } from '../../_utils'
import { BaseSchema } from '../../_utils/form_schema/schema'
import type FormGroupControl from './group_control'
import type { InternalFormFieldProps, InternalFieldMeta, InternalNamePath } from '../internal_props'
import type { NamePath } from '../props'
import type { SchemaIssue } from '../../_utils/form_schema/interface'
import { getIn } from '../utils/value'

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
    return [parentName, ...this._name].filter(Boolean).join('_')
  }

  // 是否被隐式依赖，形如 ['username'] 与 ['username', 'a', 'b']
  // ['username', 'a'] 会影响 ['username']
  // ['username'] 不会影响 ['username', 'a'] ?
  isImplicate(namePath: NamePath) {
    const path = toArray(namePath)
    const len = Math.min(path.length, this._name.length)
    for (let i = 0; i < len; i++) {
      if (path[i] !== this._name[i]) return false
    }
    // name 不合法也返回 false
    return len > 0 && this._name.length <= path.length
  }

  // 是否应该更新自己
  shouldUpdate(prev: any, current: any) {
    // name 优先级高于 shouldUpdate, 非隐式依赖就不用更新了
    if (this._key) return getIn(prev, this._name) !== getIn(current, this._name)

    const { shouldUpdate } = this._props

    if (shouldUpdate === true) return true // shouldUpdate = true
    // TODO: 如何拿到之前的 state ?
    if (isFunction(shouldUpdate)) return shouldUpdate(prev, current)
    return false
  }

  _parent: FormGroupControl | undefined = undefined

  setParent(parent?: FormGroupControl) {
    this._parent = parent
    return this
  }

  _props: Partial<InternalFormFieldProps> = {}

  setFieldProps(props: Partial<InternalFormFieldProps>) {
    this._props = isObjectLike(props) ? props : {}
  }

  private _touched = false

  private _dirty = false

  private _pending = false

  private _errors: string[] = []

  getFieldMeta(): InternalFieldMeta {
    return {
      dirty: this._dirty,
      touched: this._touched,
      pending: this._pending,
      errors: this._errors,
      warnings: [], // TODO: 后续加上
    }
  }

  setFieldMeta(meta: Partial<InternalFieldMeta>) {
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
