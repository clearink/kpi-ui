/* eslint-disable max-classes-per-file, class-methods-use-this */

import isEqual from 'react-fast-compare'
import type { MutableRefObject } from 'react'
import BaseControl from './base_control'
import { isFunction, isNullish, isUndefined } from '../../../utils'
import { getIn } from '../utils/value'
import { _getName } from '../utils/path'

import type { FormInitialControl } from './group_control'
import type {
  UpdateFieldActionType as ActionType,
  InternalFormFieldProps,
  FieldMeta,
  InternalNamePath,
} from '../internal_props'
import type { Options, SchemaIssue } from '../../../utils/form_schema/interface'

export default class FormFieldControl extends BaseControl {
  public _key: string // 唯一标识

  public constructor(
    public _name: InternalNamePath, // 记录 name
    _forceUpdate: () => void,
    private _resetField: () => void,
    private mounted: MutableRefObject<boolean>
  ) {
    super(_forceUpdate, mounted)
    this._key = _getName(_name)
  }

  public shouldUpdate = (prev: any, next: any, type: ActionType) => {
    const { _key: key, _name: name } = this
    const handler = this._props.shouldUpdate

    if (!handler && key) {
      return getIn(prev, name) !== getIn(next, name)
    }

    if (handler === true) return true

    return isFunction(handler) ? handler(prev, next, type) : false
  }

  public _props: Partial<InternalFormFieldProps> = {}

  public setFieldProps = (props: Partial<InternalFormFieldProps>) => {
    this._props = props
  }

  public _parent: FormInitialControl | null = null

  public setParent = (parent: FormInitialControl) => {
    this._parent = parent
    return this
  }

  public _touched = false

  public _dirty = false

  public _validating = false

  public _errors: string[] = []

  public _warnings: string[] = []

  public resetField = () => {
    this.setFieldMeta({
      dirty: false,
      touched: false,
      errors: [],
      warnings: [],
      validating: false,
    })
    this.mounted.current && this._resetField()
  }

  public getFieldMeta = (): FieldMeta => {
    return {
      name: this._name,
      dirty: this.isDirty(),
      touched: this.isTouched(),
      validating: this._validating,
      errors: this._errors,
      warnings: [], // TODO: 后续加上
    }
  }

  // 字段是否改变过
  public isDirty = () => {
    if (this._dirty || !isUndefined(this._props.initialValue)) {
      return true
    }

    if (!this._parent) return false

    return !isUndefined(this._parent.getInitialValue(this._name))
  }

  // 字段是否 touch 过
  public isTouched = () => {
    return this._touched
  }

  public isValidating = () => {
    return this._validating
  }

  public setFieldMeta = (meta: Partial<FieldMeta>) => {
    const prev = this.getFieldMeta()
    // 同步全部
    !isNullish(meta.dirty) && (this._dirty = meta.dirty)
    !isNullish(meta.validating) && (this._validating = meta.validating)
    !isNullish(meta.touched) && (this._touched = meta.touched)
    !isNullish(meta.errors) && (this._errors = meta.errors)
    !isNullish(meta.warnings) && (this._warnings = meta.warnings)

    const current = this.getFieldMeta()

    if (!isEqual(prev, current)) this._props.onMetaChange?.(current)
  }

  private lastValidate: null | Promise<any> = null

  // 字段校验
  public validate = (value: any, options?: Options) => {
    const { rule: validator } = this._props

    // 没有操作过的字段不能校验, 没有校验规则的也不用校验
    if (!this._touched || !validator) return

    this.setFieldMeta({ validating: true, errors: [], warnings: [] })

    const promise = validator.validate(value, options)

    this.lastValidate = promise

    return promise
      .then(() => undefined)
      .catch((e) => e)
      .then((error = {}) => {
        if (this.lastValidate !== promise) return

        const { issues = [] } = error as { issues: SchemaIssue[] }

        const errors = issues.map((issue) => issue.message) as string[]

        this.setFieldMeta({ validating: false, errors })
      })
  }
}

// 不合法的字段
export class InvalidField {
  static isInvalid(field: FormFieldControl | InvalidField): field is InvalidField {
    return field instanceof InvalidField
  }

  constructor(public name: InternalNamePath) {}
}
