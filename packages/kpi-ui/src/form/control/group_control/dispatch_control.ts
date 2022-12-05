/* eslint-disable class-methods-use-this */
import { isDependent } from '../../utils/path'
import { isFunction, logger } from '../../../_utils'
import { cloneWithPath } from '../../utils/value'

import type { FieldData, NamePath } from '../../props'
import type FormFieldControl from '../field_control'
import type FormStateControl from './state_control'
import type {
  UpdateFieldAction as Action,
  UpdateFieldActionType as ActionType,
} from '../../internal_props'

// 负责调度逻辑
export default class FormDispatchControl<State = any> {
  public constructor(public $state: FormStateControl<State>) {}

  private getControls = (pure = false) => {
    return this.$state.getControls(pure)
  }

  // 注册字段
  public registerField = (control: FormFieldControl) => {
    return this.$state.registerField(control, this)
  }

  // 更新视图
  public updateControl = (prev: State, next: State, type: ActionType) => {
    // 获取需要更新的 control
    const controls = this.getControls().reduce((res, control) => {
      if (control.shouldUpdate(prev, next, type)) res.push(control)
      return res
    }, [] as FormFieldControl[])

    // 校验依赖字段
    const dependencies = this.publishDependentControl(controls)

    // TODO: 完善
    // form 使用了 render props 方式
    if (this.$state.formChildrenIsFunctional) {
      // 更新 form
      // this.forceUpdateForm()
    } else {
      // 更新 control
      controls.concat(dependencies).forEach((control) => control.forceUpdate())
    }
    // 通知监听事件
    this.publishWatch()
    return [controls, dependencies] as const
  }

  // 调度方法
  public dispatch = (action: Action) => {
    const { $state } = this

    // 由用户事件主动触发
    if (action.type === 'fieldEvent') {
      const [prev, next] = $state.setFieldValue(action.name, action.value)
      // 更新字段
      const [, dependencies] = this.updateControl(prev, next, action.type)
      // 触发回调
      const changedValues = cloneWithPath(next, action.name)
      this.triggerOnValuesChange(changedValues)
      // 触发回调
      const nameList = [action.name, ...dependencies.map(({ _name }) => _name)]
      this.triggerOnFieldsChange(nameList)

      return
    }

    // 调用 setFieldValue, setFields 方法
    if (action.type === 'setFields') {
      // 更新字段 meta 属性
      action.fields.forEach((field) => $state.setFieldMeta(field.name, field))
      // 获得更新数据
      const [prev, next] = $state.setFieldsData(action.fields)
      // 更新字段
      return this.updateControl(prev, next, action.type)
    }

    // 调用 setFieldsValue 方法
    if (action.type === 'setFieldsValue') {
      const [prev, next] = $state.setFieldsValue(action.state)

      return this.updateControl(prev, next, action.type)
    }

    // 删除字段，主要时通知 dependence
    if (action.type === 'removeField') {
      return
    }

    // 注册字段
    if (action.type === 'registerField') {
      const [prev, next] = $state.ensureInitialized(action.control)

      return this.updateControl(prev, next, action.type)
    }

    // 重置字段
    if (action.type === 'resetFields') {
      // 重置表单数据
      const [prev, init] = $state.initialFieldsValue(action.nameList)
      const controls = $state.getControlsByName(true, action.nameList)

      // 设置字段初始值
      const next = controls.reduce((_, control) => {
        return $state.ensureInitialized(control)[1]
      }, init)

      // 重挂载组件以消除副作用
      controls.forEach((control) => control.resetField())

      return this.updateControl(prev, next, action.type)
    }

    logger.error(true, 'invalid action type')
  }

  // 设置一组字段状态
  public setFields = (fields: FieldData[]) => {
    this.dispatch({ type: 'setFields', fields })
  }

  // 设置字段值
  public setFieldValue = (name: NamePath, value: any) => {
    this.dispatch({ type: 'setFields', fields: [{ name, value }] })
  }

  // 设置多个字段值
  public setFieldsValue = (state: Partial<State>) => {
    this.dispatch({ type: 'setFieldsValue', state })
  }

  // 重置字段
  public resetFields = (nameList?: NamePath[]) => {
    this.dispatch({ type: 'resetFields', nameList })
  }

  // 通知监听字段
  public publishWatch = () => {}

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  // 提交表单
  public submitForm = () => {
    this.validateFields().then(this.triggerOnFinish, this.triggerOnFailed)
  }

  // 校验指定字段
  public validateField = (namePath: NamePath) => {
    return this.validateFields([namePath])
  }

  // 校验多个字段, 不传默认校验全部
  public validateFields = (fields?: NamePath[]) => {
    const controls = this.$state.getValidateControls(fields)

    const validateList = controls.map((control) => {
      const value = this.$state.getFieldValue(control._name)
      // 主动改成 touched
      control.setFieldMeta({ touched: true })
      return control.validate(value)
    })

    // TODO: 确定逻辑
    const returnPromise = Promise.all(validateList).then(() => {
      const nameList = controls.map(({ _name }) => _name)
      const validateErrors = this.$state
        .getFieldsError(nameList)
        .filter(({ errors }) => errors.length > 0)

      this.triggerOnFieldsChange(controls.map(({ _name }) => _name))

      const values = this.$state.getFieldsValue(fields)
      if (validateErrors.length) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ errorFields: validateErrors, values })
      }

      return values
    })

    // 控制台不展示错误信息
    returnPromise.catch((e) => e)

    return returnPromise
  }

  public isFieldTouched = (namePath: NamePath) => {
    return this.isFieldsTouched([namePath])
  }

  // 检查全部字段是否都触发过 onBlur
  public isFieldsTouched = (fields?: NamePath[]) => {
    const untouchedFields = this.getControls(true).filter((control) => {
      if (!fields) return false

      const { touched } = control.getFieldMeta()
      const implicate = fields.some((fieldName) => {
        return isDependent(control._name, fieldName)
      })
      return implicate && !touched
    })
    return untouchedFields.length === 0
  }

  // 通知依赖字段
  public publishDependentControl = (controls: FormFieldControl[]) => {
    const dependencies = this.$state.findDependencies(controls)

    // 仅需要校验 dirty 与 touched 字段
    const nameList = dependencies
      .filter((control) => control.isDirty() || control.isTouched())
      .map(({ _name }) => _name)

    nameList.length && this.validateFields(nameList)

    // 尽量更新所有依赖字段
    return dependencies
  }

  /** ==================================================== */
  /** callbacks                                            */
  /** ==================================================== */
  // 触发 onValuesChange 回调
  public triggerOnValuesChange = (changedValues: Partial<State>) => {
    const { onValuesChange } = this.$state._props

    if (!isFunction(onValuesChange)) return

    onValuesChange(changedValues, this.$state.getFieldsValue())
  }

  // 触发 onFieldsChange 回调
  public triggerOnFieldsChange = (nameList: NamePath[]) => {
    const { onFieldsChange } = this.$state._props

    if (!isFunction(onFieldsChange)) return

    const changedFields = this.$state.getFields(nameList)
    const allFields = this.$state.getFields()

    onFieldsChange(changedFields, allFields)
  }

  // 触发 onFinish 回调
  public triggerOnFinish = (values: State) => {
    const { onFinish } = this.$state._props
    if (!isFunction(onFinish)) return

    try {
      onFinish(values)
    } catch (error) {
      // onFinish失败时需要打印失败原因
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  // 触发 onFailed 回调
  public triggerOnFailed = (errors: any) => {
    const { onFailed } = this.$state._props
    if (!isFunction(onFailed)) return
    onFailed(errors)
  }
}
