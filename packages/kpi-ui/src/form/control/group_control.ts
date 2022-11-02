/* eslint-disable class-methods-use-this */
import cloneDeep from 'lodash.clonedeep'
import BaseControl from './base_control'
import { isUndefined, logger, toArray } from '../../_utils'
import { setIn, getIn, deleteIn, mergeValue, cloneWithPath } from '../utils/value'
import type {
  UpdateFieldAction as Action,
  FieldMeta,
  InternalFormInstance,
  InternalHookReturn,
  WatchCallBack,
} from '../internal_props'
import type { NamePath } from '../props'
import type FormFieldControl from './field_control'
import { getPaths, isDependent } from '../utils/path'

export const HOOK_MARK = Symbol('_$_KPI_FORM_HOOK_MARK_$_')

export default class FormGroupControl<State = any> extends BaseControl {
  // 向外暴露的函数
  injectForm = (): InternalFormInstance<State> => {
    return {
      setFieldValue: (namePath: NamePath, value: any) =>
        this.setFieldValue(namePath, value, 'setField'),
      setFieldsValue: this.setFieldsValue.bind(this),

      getFieldValue: this.getFieldValue.bind(this),
      getFieldsValue: this.getFieldsValue.bind(this),

      validateField: this.validateField.bind(this),
      validateFields: this.validateFields.bind(this),

      submitForm: this.submitForm.bind(this),
      resetFields: this.resetFields.bind(this),

      isFieldTouched: this.isFieldTouched.bind(this),
      isFieldsTouched: this.isFieldsTouched.bind(this),

      scrollToField: this.scrollToField.bind(this),

      /** @private */
      getInternalHooks: this._getInternalHooks.bind(this),
    }
  }

  // 字段删除时是否保存属性
  private _preserve = true

  // 表单名称
  private _name: string | undefined = undefined

  // 内部属性
  private _getInternalHooks(secret: symbol): InternalHookReturn | undefined {
    const matched = secret === HOOK_MARK

    logger.warn(!matched, '`getInternalHooks` is internal usage. Should not call directly.')
    if (!matched) return undefined

    return {
      setInitialValues: this.setInitialValues.bind(this),
      registerField: this.registerField.bind(this),
      registerWatch: this.registerWatch.bind(this),
      subscribe: this.subscribe.bind(this),
      ensureInitialized: this.ensureInitialized.bind(this),
      setFieldMeta: this.setFieldMeta.bind(this),
      dispatch: this.dispatch.bind(this),
      // eslint-disable-next-line no-return-assign
      setPreserve: (preserve = true) => (this._preserve = preserve),
      // eslint-disable-next-line no-return-assign
      setFormName: (name?: string) => (this._name = name),
    }
  }

  // 收集当前表单的数据
  private getFieldsValue(fields: NamePath[] = []) {
    const uniqueControls = this.controls.filter((control) => {
      if (!control._key) return false // 去除name无效的 field
      if (fields.length === 0) return true
      return fields.some((field) => isDependent(control._name, field))
    })
    // 深拷贝原始值防止 setIn 时被错误覆盖
    const cloned = cloneDeep(this._state)
    return uniqueControls.reduce((values, control) => {
      const value = getIn(cloned, control._name)
      return setIn(values ?? ({} as State), control._name, value)
    }, {} as State)
  }

  // 默认值
  private _initial = {} as Partial<State>

  private setInitialValues(initial?: Partial<State>) {
    this._initial = initial || {}
  }

  private getInitialValue(name: NamePath) {
    const value = getIn(this._initial, toArray(name))
    return cloneDeep(value)
  }

  // 设置字段初始值
  private ensureInitialized(namePath: NamePath, $initialValue?: any) {
    if (!FormGroupControl._getName(namePath)) return // name 无效
    if (this.getFieldValue(namePath) !== undefined) return // 该字段值不为 undefined

    const topInitial = this.getInitialValue(namePath)
    const initialValue = isUndefined(topInitial) ? $initialValue : topInitial
    logger.warn(
      !isUndefined(topInitial) && !isUndefined($initialValue),
      "form has initialValues, don't set field initialValue"
    )

    if (isUndefined(initialValue)) return
    setIn(this._state, toArray(namePath), initialValue)
  }

  // 更新字段
  private updateControl(prev: State, next: State, action: Action) {
    // 获取需要更新的 control
    const uniqueControls = this.controls.reduce((set, control) => {
      if (control.shouldUpdate(prev, next, action)) set.add(control)
      return set
    }, new Set<FormFieldControl>())
    // 强制更新 control
    uniqueControls.forEach((control) => control.forceUpdate())
  }

  private dispatch(action: Action) {
    // 用户事件触发
    if (action.type === 'fieldEvent' || action.type === 'setField') {
      const { name, value, type } = action
      this.setFieldValue(name, value, type)
    }
    // this.updateControl(prev, current, { type: 'fieldEvent' })
  }

  // store
  private _state = {} as State

  private setValueByEvent() {}

  // 设置字段值
  private setFieldValue(namePath: NamePath, value: any, type: 'setField' | 'fieldEvent') {
    // 无效字段路径 不处理
    if (!FormGroupControl._getName(namePath)) return
    const paths = toArray(namePath)
    // 仅浅拷贝相关路径
    const prev = cloneWithPath(this._state, paths)
    const next = setIn(this._state, paths, value)
    this.updateControl(prev, next, { type, name: paths, value })
  }

  // 设置多个字段值
  private setFieldsValue(state: Partial<State>) {
    // 仅浅拷贝相关路径
    const prev = getPaths(state).reduce((res, paths) => {
      return cloneWithPath(res, paths)
    }, this._state)
    // 与现有的 state 进行 merge
    this._state = mergeValue(this._state, state)
    this.updateControl(prev, this._state, { type: 'valueUpdate', name: [] })
  }

  private getFieldValue(namePath: NamePath) {
    const value = getIn(this._state, toArray(namePath))
    return cloneDeep(value)
  }

  private deleteFieldValue(namePath: NamePath) {
    const paths = toArray(namePath)
    // 路径为空代表删除整个对象，得到 undefined，故此处重置为空对象
    if (paths.length === 0) this._state = {} as State
    else deleteIn(this._state, paths)
  }

  private _controls = new Set<FormFieldControl>()

  get controls() {
    return [...this._controls.values()]
  }

  // 注册字段
  // 同名字段是个很恶心的东西
  registerField(control: FormFieldControl) {
    const { _key: key, _name: name } = control

    this._controls.add(control.setParent(this))

    if (!isUndefined(control._props.initialValue)) {
      console.log('resetWithFieldInitialValue', console.log(control._name))
    }

    // 取消注册， 清除副作用
    return ($preserve?: boolean) => {
      const preserve = $preserve ?? this._preserve
      this._controls.delete(control) // 清空空字段

      const hasSameField = this.controls.find(({ _key }) => _key === key)
      // 不保留数据 && name 合法 && 没有同名字段
      if (!preserve && key && !hasSameField) this.deleteFieldValue(name)
    }
  }

  // 字段依赖 当数据变更时就会重新校验相应的字段
  private _dependencies = new Map<string, Map<string, NamePath>>()

  // 订阅对应的字段变更，并通知相应的 control
  private subscribe(namePath: NamePath, dependencies: NamePath[] = []) {
    const fieldName = BaseControl._getName(namePath)
    if (!fieldName) return () => {} // 为空不进行操作

    const cancels = dependencies.map((dependency) => {
      // 被依赖项
      const depName = BaseControl._getName(dependency)
      if (!depName || fieldName === depName) return () => {}

      const cached = this._dependencies.get(depName) ?? new Map<string, NamePath>()
      this._dependencies.set(depName, cached.set(fieldName, namePath))
      return () => {
        const current = this._dependencies.get(depName)
        current?.delete(fieldName)
        current?.size === 0 && this._dependencies.delete(depName)
      }
    })
    return () => cancels.forEach((cancel) => cancel())
  }

  // 实现 useWatch 功能
  private _watchList: { namePath: NamePath; callback: WatchCallBack<State> }[] = []

  private registerWatch(namePath: NamePath, callback: WatchCallBack) {
    this._watchList.push({ namePath, callback })
    return () => {
      this._watchList = this._watchList.filter(({ callback: fn }) => fn !== callback)
    }
  }

  // 设置 FormField 的 meta 属性
  private setFieldMeta(namePath: NamePath, meta: Partial<FieldMeta>) {
    for (const control of this.controls) {
      if (!isDependent(control._name, namePath)) continue
      control.setFieldMeta(meta)
    }
  }

  // 检查全部字段是否没有 errors
  private isFormValid() {
    const invalidFields = this.controls.filter((control) => {
      const { errors = [] } = control.getFieldMeta()
      return errors.length > 0
    })
    return invalidFields.length > 0
  }

  // 检查全部字段是否都触发过 onBlur
  private isFieldsTouched(fields: NamePath[] = []) {
    const untouchedFields = this.controls.filter((control) => {
      if (fields.length === 0) return false
      const { touched } = control.getFieldMeta()
      const implicate = fields.some((fieldName) => {
        return isDependent(control._name, fieldName)
      })
      return implicate && !touched
    })
    return untouchedFields.length === 0
  }

  private isFieldTouched(namePath: NamePath) {
    return this.isFieldsTouched([namePath])
  }

  // 检查全部字段是否都触发过 onChange 事件
  private isFieldsDirty(fields: NamePath[] = []) {
    const pristineFields = this.controls.filter((control) => {
      if (fields.length === 0) return false
      const { dirty } = control.getFieldMeta()
      const implicate = fields.some((fieldName) => {
        return isDependent(control._name, fieldName)
      })
      return implicate && !dirty
    })
    return pristineFields.length === 0
  }

  private isFieldDirty(namePath: NamePath) {
    return this.isFieldsDirty([namePath])
  }

  // 检查全部字段是否有正在校验的字段
  private isFieldsPending(fields: NamePath[] = []) {
    const pendingFields = this.controls.filter((control) => {
      if (fields.length === 0) return false
      const { pending } = control.getFieldMeta()
      const implicate = fields.some((fieldName) => {
        return isDependent(control._name, fieldName)
      })
      return implicate && !!pending
    })
    return pendingFields.length > 0
  }

  private isFieldPending(namePath: NamePath) {
    return this.isFieldsPending([namePath])
  }

  private validateFields(fields: NamePath[] = []) {
    const list = this.controls
      .filter((control) => {
        // 空数组视为校验全部字段
        if (fields.length === 0) return true
        return fields.some((namePath) => {
          return isDependent(control._name, namePath)
        })
      })
      .map((control) => {
        const value = this.getFieldValue(control._name)
        return control.validate(value)
      })
    // TODO: 确定逻辑
    return Promise.all(list).then(() => this.getFieldsValue())
  }

  // 校验指定字段
  private validateField(namePath: NamePath) {
    this.validateFields([namePath])
  }

  // 提交表单
  private async submitForm(onFinish, onFailed) {
    try {
      const values = await this.validateFields()
      onFinish?.(values)
    } catch (error) {
      logger.error(true, error)
      onFailed?.('TODO')
    }
  }

  // 重置表单
  private resetFields(fields: NamePath[] = []) {
    const controls = this.controls.filter((control) => {
      if (fields.length === 0) return true
      return fields.some((namePath) => isDependent(control._name, namePath))
    })
  }

  // 滚动到对应位置
  private scrollToField(namePath: NamePath = []) {
    const key = FormGroupControl._getName(namePath)
    if (!key) return
    const control = this.controls.find(({ _key }) => _key === key)
    const fieldId = control?._getId(this._name)
    if (fieldId === undefined) return
    const dom = document.querySelector(`#${fieldId}`)
    dom?.scrollIntoView({ behavior: 'smooth' })
  }
}
