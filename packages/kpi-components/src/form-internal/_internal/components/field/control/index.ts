import { isEqual, isFunction, isNullish, isUndefined, noop, toArray } from '@kpi-ui/utils'
import { _getName } from '../../../utils/path'
import { getIn } from '../../../utils/value'

import type {
  FormActionType,
  ExternalNamePath,
  InternalFieldMeta,
  InternalNamePath,
} from '../../../props'

import type { InternalFormFieldProps } from '../props'

type SchemaIssue = any
type Options = any

export class FormFieldControl {
  public _key = ''

  public _name: InternalNamePath = []

  public _handler: InternalFormFieldProps['shouldUpdate']

  public forceUpdate: () => void

  public constructor(
    _forceUpdate: () => void,
    private _reset: () => void,
    private mounted: () => boolean
  ) {
    this.forceUpdate = () => mounted() && _forceUpdate()
  }

  public shouldUpdate = (prev: any, next: any, type: FormActionType) => {
    const { _key: key, _name: name, _handler: handler } = this

    if (isUndefined(handler) && key) return getIn(prev, name) !== getIn(next, name)

    return isFunction(handler) ? handler(prev, next, type) : !!handler
  }

  public _props: Partial<InternalFormFieldProps> = {}

  public setInternalFieldProps = (props: Partial<InternalFormFieldProps>) => {
    // TODO: 需要验证直接赋值与浅赋值之间是否有性能问题
    this._props = props
    // this._props = { ...props }

    this._handler = props.shouldUpdate

    if (this._name === props.name) return

    this._key = _getName(props.name!)

    this._name = props.name ?? []
  }

  private _getInitial: (() => any) | undefined

  public setGetInitial = (getInitial: () => any) => {
    this._getInitial = getInitial
  }

  // 字段是否 touch 过
  public _touched = false

  private _dirty = false

  // 字段是否改变过
  public get dirty() {
    if (this._dirty || !isUndefined(this._props.initialValue)) return true

    return !!(this._getInitial && !isUndefined(this._getInitial()))
  }

  public _validating = false

  public _errors: string[] = []

  public _warnings: string[] = []

  public get meta(): InternalFieldMeta {
    return {
      name: this._name,
      dirty: this.dirty,
      touched: this._touched,
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

  public metaUpdate = (meta: Partial<InternalFieldMeta>) => {
    const prev = this.meta
    // 同步全部
    !isNullish(meta.dirty) && (this._dirty = meta.dirty)
    !isNullish(meta.touched) && (this._touched = meta.touched)
    !isNullish(meta.errors) && (this._errors = meta.errors)
    !isNullish(meta.warnings) && (this._warnings = meta.warnings)
    !isNullish(meta.validating) && (this._validating = meta.validating)

    this.lastValidate = this._validating ? Promise.resolve([]) : null

    const current = this.meta

    const mounted = this.mounted()

    // meta 属性前后一致且此时组件没有销毁 可以直接返回
    if (isEqual(prev, current) && mounted) return

    const { onMetaChange, children } = this._props

    onMetaChange?.({ ...current, mounted })

    isFunction(children) && this.forceUpdate()
  }

  private lastValidate: null | Promise<any> = null

  // 字段校验
  public validate = async (value: any, options?: Options) => {
    const { rule: validator } = this._props

    // 没有操作过的字段不能校验, 没有校验规则的也不用校验
    if (!this._touched || !validator || !this._key) return

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
export class InvalidFieldControl {
  public _name: InternalNamePath

  public _errors: string[] = []

  public _warnings: string[] = []

  public _props: Partial<InternalFormFieldProps> = {}

  constructor(name: ExternalNamePath) {
    this._name = toArray(name)
  }
}
