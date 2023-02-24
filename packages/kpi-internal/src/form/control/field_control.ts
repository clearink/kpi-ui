/* eslint-disable max-classes-per-file, class-methods-use-this */
import { isEqual, isFunction, isNullish, isUndefined, toArray } from '@kpi/shared'
import type { Options, SchemaIssue } from '@kpi/validate'
import BaseControl from './base_control'
import { getIn } from '../utils/value'
import { _getName } from '../utils/path'

import type { FormInitialControl } from './group_control'
import type { NamePath } from '../props'
import type {
  UpdateFieldActionType as ActionType,
  InternalFormFieldProps,
  FieldMeta,
  InternalNamePath,
} from '../internal_props'

export default class FormFieldControl extends BaseControl {
  public _key: string = ''

  public _name: InternalNamePath = []

  public _handler: InternalFormFieldProps['shouldUpdate']

  public constructor(
    _forceUpdate: () => void,
    private _reset: () => void,
    private mounted: () => boolean
  ) {
    super(_forceUpdate, mounted)
  }

  public shouldUpdate = (prev: any, next: any, type: ActionType) => {
    const { _key: key, _name: name, _handler: handler } = this

    if (!handler && key) return getIn(prev, name) !== getIn(next, name)

    return isFunction(handler) ? handler(prev, next, type) : !!handler
  }

  public _props: Partial<InternalFormFieldProps> = {}

  public setFieldProps = (props: Partial<InternalFormFieldProps>) => {
    this._props = { ...props }

    this._handler = props.shouldUpdate

    if (this._name === props.name) return

    this._key = _getName(props.name!)

    this._name = props.name ?? []
  }

  public _parent: FormInitialControl | null = null

  public setParent = (parent: FormInitialControl) => {
    this._parent = parent
  }

  public _touched = false

  // 字段是否 touch 过
  public get touched() {
    return this._touched
  }

  public _dirty = false

  // 字段是否改变过
  public get dirty() {
    if (this._dirty || !isUndefined(this._props.initialValue)) return true

    const parent = this._parent

    if (!parent) return false

    return !isUndefined(parent.getInitialValue(this._name))
  }

  public _validating = false

  public _errors: string[] = []

  public _warnings: string[] = []

  public get meta(): FieldMeta & { mounted: boolean } {
    return {
      mounted: this.mounted(),
      name: this._name,
      dirty: this.dirty,
      touched: this.touched,
      validating: this._validating,
      errors: this._errors,
      warnings: [], // TODO: 后续加上
    }
  }

  public reset = () => {
    this.metaUpdate({
      dirty: false,
      touched: false,
      errors: [],
      warnings: [],
      validating: false,
    })

    this.lastValidate = null
    this.mounted() && this._reset()
  }

  public isValidating = () => {
    return this._validating
  }

  public metaUpdate = (meta: Partial<FieldMeta>) => {
    const prev = this.meta
    // 同步全部
    !isNullish(meta.dirty) && (this._dirty = meta.dirty)
    !isNullish(meta.touched) && (this._touched = meta.touched)
    !isNullish(meta.errors) && (this._errors = meta.errors)
    !isNullish(meta.warnings) && (this._warnings = meta.warnings)

    !isNullish(meta.validating) && (this._validating = meta.validating)

    this.lastValidate = this._validating ? Promise.resolve([]) : null

    const current = this.meta

    if (isEqual(prev, current)) return

    const { onMetaChange, children } = this._props

    onMetaChange?.(current)

    isFunction(children) && this.forceUpdate()
  }

  private lastValidate: null | Promise<any> = null

  // 字段校验
  public validate = async (value: any, options?: Options) => {
    const { rule: validator } = this._props

    // 没有操作过的字段不能校验, 没有校验规则的也不用校验
    if (!this._touched || !validator || !this._key) return

    this.metaUpdate({ validating: true, errors: [], warnings: [] })

    const promise = validator.validate(value, options)
    this.lastValidate = promise

    return promise
      .then(() => undefined)
      .catch((e) => e)
      .then((error = {}) => {
        if (this.lastValidate !== promise) return

        const { issues = [] } = error as { issues: SchemaIssue[] }
        const errors = issues.map((issue) => issue.message) as string[]
        this.metaUpdate({ validating: false, errors })
      })
  }
}

// 不合法的字段
export class InvalidField {
  static isInvalid(field: FormFieldControl | InvalidField): field is InvalidField {
    return field instanceof InvalidField
  }

  public name: InternalNamePath

  constructor(name: NamePath) {
    this.name = toArray(name)
  }
}
