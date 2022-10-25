/* eslint-disable class-methods-use-this */
import BaseControl from './base_control'
import { isUndefined, logger, toArray } from '../../_utils'
import { setIn, getIn, deleteIn, mergeValue, getPaths } from '../utils/value'
import type {
  InternalFieldMeta,
  InternalFormInstance,
  InternalHookReturn,
  WatchCallBack,
} from '../internal_props'
import type { NamePath } from '../props'
import type FormFieldControl from './field_control'

export const HOOK_MARK = '_$_KPI_FORM_HOOK_MARK_$_'

export default class FormGroupControl<State = any> extends BaseControl {
  // 向外暴露的函数
  injectForm = (): InternalFormInstance<State> => {
    return {
      setFieldValue: this.setFieldValue.bind(this),
      setFieldsValue: this.setFieldsValue.bind(this),

      getFieldValue: this.getFieldValue.bind(this),
      getFieldsValue: this.getFieldsValue.bind(this),

      validateField: this.validateField.bind(this),
      validateFields: this.validateFields.bind(this),

      submitForm: this.submitForm.bind(this),
      resetFields: this.resetFields.bind(this),

      isFieldTouched: this.isFieldTouched.bind(this),
      isFieldsTouched: this.isFieldsTouched.bind(this),

      /** @private */
      getInternalHooks: this._getInternalHooks.bind(this),
    }
  }

  // 字段删除时是否保存属性
  private _preserve = true

  // 内部属性
  private _getInternalHooks(secret: string): InternalHookReturn | undefined {
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
      // eslint-disable-next-line no-return-assign
      setPreserve: (preserve = true) => (this._preserve = preserve),
    }
  }

  // 收集当前表单的数据
  private getFieldsValue(fields: NamePath[] = []) {
    return this.controls
      .filter((control) => {
        if (!control._key) return false // 去除name无效的 field
        if (fields.length === 0) return true
        return fields.some((field) => control.isImplicate(field))
      })
      .reduce((values, control) => {
        const value = getIn(this._state, control._name)
        return setIn(values ?? ({} as State), control._name, value)
      }, {} as State)
  }

  // 默认值
  private _initial = {} as Partial<State>

  private setInitialValues(initial?: Partial<State>) {
    this._initial = initial || {}
  }

  private getInitialValue(name: NamePath) {
    return getIn(this._initial, toArray(name))
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
    if (!isUndefined(initialValue)) this.setFieldValue(namePath, initialValue)
  }

  // TODO: 获取需要更新的字段逻辑还需要优化
  private updateControl(namePath: NamePath, prev: State, current: State) {
    for (const control of this.controls) {
      if (!control.shouldUpdate(namePath, prev, current)) continue
      control.forceUpdate()
    }
  }

  // store
  private _state = {} as State

  // TODO: 值相等时不更新当前 control，但是隐式依赖的字段呢？
  private setFieldValue(namePath: NamePath, value: any, shouldValidate = false) {
    if (!FormGroupControl._getName(namePath)) return // 无效字段路径 不处理
    this.setFieldsValue(setIn({}, toArray(namePath), value))
  }

  // 只有字段值变更了才需要刷新视图， meta 变化仅仅调用 onMetaChange 事件即可
  // TODO: 增加相关逻辑
  private setFieldsValue(state: Partial<State>) {
    const prev = this._state
    // 获取 prev 里面的全部属性并组成 path 然后调用 control.shouldUpdate() ，最后去重
    this._state = mergeValue(this._state, state)
    const paths = getPaths(state)
    console.log(paths)
    this.updateControl([], prev, this._state)
    // 与现有的 state 进行 merge
    /**
     * Copy values into store and return a new values object
     * ({ a: 1, b: { c: 2 } }, { a: 4, b: { d: 5 } }) => { a: 4, b: { c: 2, d: 5 } }
     */
  }

  private getFieldValue(namePath: NamePath) {
    return getIn(this._state, toArray(namePath))
  }

  private deleteFieldValue(namePath: NamePath) {
    const paths = toArray(namePath)
    // 路径为空代表删除整个对象，得到 undefined，故此处重置为空对象
    if (paths.length === 0) this._state = {} as State
    else this._state = deleteIn(this._state, paths)
  }

  private _controls = new Map<string, Set<FormFieldControl>>()

  get controls() {
    return [...this._controls.values()].reduce((res, set) => {
      return res.concat([...set.values()])
    }, [] as FormFieldControl[])
  }

  // 注册字段
  // 同名字段是个很恶心的东西
  registerField(control: FormFieldControl) {
    const { _key: key, _name: name } = control

    const cached = this._controls.get(key) ?? new Set<FormFieldControl>()

    this._controls.set(key, cached.add(control.setParent(this)))

    // 取消注册， 清除副作用
    return ($preserve?: boolean) => {
      const preserve = $preserve ?? this._preserve
      const controls = this._controls.get(key)
      controls?.delete(control)
      if (controls?.size !== 0) return
      this._controls.delete(key) // 清空空字段
      // 没有同名字段且 name 合法不保留数据
      !preserve && key && this.deleteFieldValue(name)
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
  private setFieldMeta(namePath: NamePath, meta: Partial<InternalFieldMeta>) {
    for (const control of this.controls) {
      if (!control.isImplicate(namePath)) continue
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
      const implicate = fields.some((fieldName) => control.isImplicate(fieldName))
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
      const implicate = fields.some((fieldName) => control.isImplicate(fieldName))
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
      const implicate = fields.some((fieldName) => control.isImplicate(fieldName))
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
        return fields.some((namePath) => control.isImplicate(namePath))
      })
      .map((control) => {
        const value = this.getFieldValue(control._name)
        return control.validate(value)
      })
    return Promise.all(list).then(() => this.getFieldsValue(fields))
  }

  // 校验指定字段
  private validateField(namePath: NamePath) {
    this.validateFields([namePath])
  }

  // 提交表单
  private async submitForm(onFinish, onFailed) {
    try {
      const values = this.validateFields()
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
      return fields.some((namePath) => control.isImplicate(namePath))
    })
  }
}

// 校验时不能只更新当前字段， 要调用 upDateControl 函数
// setFields 需要比较与 prev 是否相等才 updateControl
// TODO: 完成 this.controls 的剩余逻辑

/**
 * import React, { useState } from 'react'
import { Form, kfc, Space } from '../../../src'
import useForm from '../../../src/form/hooks/use_form'
import '../../../src/pagination/style'
import './style.css'


function Input(props: any) {
  let value
  if ('value' in props) value = props.value || 0
  return (
    <input
      {...props}
      value={value}
    />
  )
}

export default function App() {
  const form = useForm()
  const [key, set] = useState(0)
  return (
    <div className="app-wrap">
      <button onClick={() => set(key + 1)}>set k</button>
      <Form
        form={form}
        key={key}
        name="basic"
      >
        <label>username</label>
        <label>age</label>

        <Form.Field name="username">
          <Input />
        </Form.Field>
        <Form.Field name={['username', 'a']}>
          <Input />
        </Form.Field>

        <Form.Field shouldUpdate>
          <Input />
        </Form.Field>

        {/* <Form.Field>
          <InputNumber />
        </Form.Field> */}
        {/* 此二种 我觉得是不管什么都要更新的 */}
        <Form.Field shouldUpdate>
          {() => {
            return (
              <button
                onClick={() => {
                  form.setFieldValue(['username', 'a'], undefined)
                }}
              >
                submit
              </button>
            )
          }}
        </Form.Field>
      </Form>
    </div>
  )
}
/**
 * listeners = Map<{
 * username: age, pwd
 * ['a', 'd']: pwd
 * }>
 */

 */