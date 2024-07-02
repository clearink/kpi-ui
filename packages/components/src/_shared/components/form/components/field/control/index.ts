import { isEqual, isFunction, isNullish, isUndefined, toArray } from '@kpi-ui/utils'

import type {
  ExternalNamePath,
  FormActionType,
  InternalFieldMeta,
  InternalNamePath,
  RuleIssue,
  RuleOptions,
} from '../../../props'
import type { InternalFormFieldProps } from '../props'

import { _getName } from '../../../utils/path'
import { getIn } from '../../../utils/value'

export class FormFieldControl {
  private _dirty = false

  public _errors: string[] = []

  private _getInitial: (() => any) | undefined

  public _key = ''

  public _name: InternalNamePath = []

  public _props: Partial<InternalFormFieldProps> = {}

  public _shouldHook: InternalFormFieldProps['shouldUpdate']

  // 字段是否 touch 过
  public _touched = false

  public _validating = false

  public _warnings: string[] = []

  private lastValidate: Promise<any> | null = null

  public forceUpdate: () => void

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

    const { children, onMetaChange } = this._props

    onMetaChange?.({ ...current, mounted })

    isFunction(children) && this.forceUpdate()
  }

  public reset = () => {
    this.metaUpdate({
      dirty: false,
      errors: [],
      touched: false,
      validating: false,
      warnings: [],
    })

    this.lastValidate = null
    this.mounted() && this._reset()
  }

  public setGetInitial = (getInitial: () => any) => {
    this._getInitial = getInitial
  }

  public setInternalFieldProps = (props: Partial<InternalFormFieldProps>) => {
    this._props = props

    this._shouldHook = props.shouldUpdate

    if (this._name === props.name) return

    this._key = _getName(props.name)

    this._name = props.name || []
  }

  public shouldUpdate = (prev: any, next: any, type: FormActionType) => {
    const { _key: key, _name: name, _shouldHook: handler } = this

    if (isUndefined(handler) && key) return getIn(prev, name) !== getIn(next, name)

    return isFunction(handler) ? handler(prev, next, type) : !!handler
  }

  // 字段校验
  public validate = async (value: any, options?: RuleOptions) => {
    const { rule: validator } = this._props

    // 没有操作过的字段不能校验, 没有校验规则的也不用校验
    if (!this._touched || !validator || !this._key) return

    const promise = validator.validate(value, options)

    this.lastValidate = promise

    return promise
      .then(() => undefined)
      .catch(e => e)
      .then((error = {}) => {
        if (this.lastValidate !== promise) return

        const { issues = [] } = error as { issues: RuleIssue[] }
        const errors = issues.map(issue => issue.message) as string[]

        this.metaUpdate({ errors, validating: false })
      })
  }

  public constructor(
    _forceUpdate: () => void,
    private _reset: () => void,
    private mounted: () => boolean,
  ) {
    this.forceUpdate = () => mounted() && _forceUpdate()
  }

  // 字段是否改变过
  public get dirty() {
    if (this._dirty || !isUndefined(this._props.initialValue)) return true

    return !isUndefined(this._getInitial?.())
  }

  public get meta(): InternalFieldMeta {
    return {
      dirty: this.dirty,
      errors: this._errors,
      name: this._name,
      touched: this._touched,
      validating: this._validating,
      warnings: [], // TODO: 后续加上
    }
  }
}

// 不合法的字段
export class InvalidFieldControl {
  public _errors: string[] = []

  public _name: InternalNamePath

  public _props: Partial<InternalFormFieldProps> = {}

  public _warnings: string[] = []

  constructor(name: ExternalNamePath) {
    this._name = toArray(name)
  }
}
