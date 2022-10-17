/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

import { MutableRefObject } from 'react'
import { isUndefined, toArray } from '../../_utils'
import { deleteIn, getIn, setIn } from '../utils'
import { BaseSchema } from '../../_utils/form_schema/schema'
import logger from '../../_utils/logger'
import type { NamePath } from '../props'
import type { InternalFormInstance, WatchCallBack } from '../internal_props'

export const HOOK_MARK = '_$_KPI_FORM_HOOK_MARK_$_'

export class BaseControl {
  forceUpdate = () => {}

  constructor(_forceUpdate: () => void, mounted: MutableRefObject<boolean>) {
    // 必须在组件挂载时调用
    this.forceUpdate = () => mounted.current && _forceUpdate()
  }

  // 获取名称字符串
  static _getName(namePath?: NamePath) {
    const paths = toArray(namePath)
    const separator = '_$_KPI_FORM_CONTROL_$_'
    return paths.map((item) => `${typeof item}:${item}`).join(separator)
  }
}

/** ===================================================== */
/** ===================================================== */
/** FormField                                             */
/** ===================================================== */
/** ===================================================== */

export class FormFieldControl extends BaseControl {
  protected _parent: FormGroupControl | undefined = undefined

  setParent(parent?: FormGroupControl) {
    this._parent = parent
  }

  _validator: BaseSchema | undefined = undefined

  setValidator(validator?: BaseSchema) {
    if (!(validator instanceof BaseSchema)) return
    this._validator = validator
  }

  // TODO: 字段校验
  async validate(value: any) {
    console.log('validate', value)
    if (!this._validator) return value
    return this._validator.validate(value)
  }
}

/** ===================================================== */
/** ===================================================== */
/** FormGroup                                             */
/** ===================================================== */
/** ===================================================== */

export class FormGroupControl<State = any> extends BaseControl {
  injectForm = (): InternalFormInstance<State> => {
    // 向外暴露函数 避免内部数据被更改
    return {
      getFieldsValue: this.getFieldsValue,
      validate: () => Promise.resolve(),
      submit: () => {},
      resetFields: () => {},
      getInternalHooks: this._getInternalHooks.bind(this),
      // eslint-disable-next-line no-return-assign
      setPreserve: (preserve = true) => (this._preserve = preserve),
    }
  }

  // TODO: 优化返回值，仅仅返回一些必要的属性
  private _getInternalHooks(secret: string) {
    const matched = secret === HOOK_MARK

    logger.warn(!matched, '`getInternalHooks` is internal usage. Should not call directly.')
    if (!matched) return undefined

    return this
  }

  // 收集当前表单的数据
  private getFieldsValue() {
    return [...this._controls].reduce((values, [, { namePath }]) => {
      const paths = toArray(namePath)
      const value = getIn(this._state, paths)
      return setIn(values ?? ({} as State), paths, value)
    }, {} as State)
  }

  // 默认值
  private _initial = {} as Partial<State>

  // TODO: 待完善
  setInitial(initial: Partial<State> | undefined, mounted: boolean) {
    this._initial = initial || {}
    if (mounted) return
    const nextState = setIn
    // merge _initial to _state
    // 组件尚未挂载， 将初始值同步到store中去
    // merge value
    // const nextState = setIn({}, )
  }

  getInitial(name: NamePath | undefined) {
    return getIn(this._initial, toArray(name))
  }

  // 设置字段初始值
  ensureFieldInitial(namePath: NamePath | undefined, initialValue: any) {
    // name 不存在 或者 已存在该值就不设置了
    if (!BaseControl._getName(namePath) || this.getFieldValue(namePath) !== undefined) return

    const topInitial = this.getInitial(namePath)
    const $initialValue = isUndefined(topInitial) ? initialValue : topInitial
    logger.warn(
      !isUndefined(topInitial) && !isUndefined(initialValue),
      "form has initialValues, don't set field initialValue"
    )
    if (!isUndefined($initialValue)) this.setFieldValue(namePath, $initialValue)
  }

  // store
  private _state = {} as State

  setFieldValue(namePath: NamePath | undefined, value: any) {
    const fieldName = BaseControl._getName(namePath)
    if (!fieldName || !namePath) return
    this._state = setIn(this._state, toArray(namePath), value)

    // 那么要如何才能通知到视图呢？
    const controls = this.get(namePath)
    if (!controls || !controls.size) return

    // TODO: 移到组件中处理比较好点，可以做一些优化项。更新视图
    // TODO: 父级使用 render props 时不在此更新视图
    controls.forEach((control) => control.forceUpdate())

    // // 运行订阅事件（目标状态为dirty 时才订阅）
    // const listeners = this._listeners.get(fieldName)
    // listeners?.forEach((controlName) => {
    //   this.get(controlName)?.forEach((control) => {
    //     const controlValue = this.getFieldValue(controlName)
    //     control.validate(controlValue)
    //   })
    // })
    // 这里是否要执行 watchList ?
  }

  getFieldValue(name?: NamePath) {
    return getIn(this._state, toArray(name))
  }

  deleteFieldValue(namePath?: NamePath) {
    const paths = toArray(namePath)
    // 路径为空代表删除整个对象，得到 undefined，故此处重置为空对象
    if (paths.length === 0) this._state = {} as State
    else this._state = deleteIn(this._state, paths)
  }

  private _preserve = true

  setPreserve(preserve = true) {
    this._preserve = preserve
  }

  _controls = new Map<string, { namePath: NamePath; control: Set<FormFieldControl> }>()

  // 获取 control
  get(namePath?: NamePath) {
    const name = BaseControl._getName(namePath)
    return this._controls.get(name)?.control
  }

  // 注册字段
  registerField(control: FormFieldControl, namePath?: NamePath) {
    const name = BaseControl._getName(namePath)
    if (!name || !namePath) return () => {}

    control.setParent(this)
    const cached = this._controls.get(name)
    if (cached) cached.control.add(control)
    else this._controls.set(name, { namePath, control: new Set([control]) })

    // 字段删除时处理一些副作用
    return (preserve?: boolean) => {
      const $preserve = preserve ?? this._preserve
      if (!$preserve) this.deleteFieldValue()
      const controls = this._controls.get(name)?.control
      controls?.delete(control)
      if (controls && !controls.size) this._controls.delete(name)
    }
  }

  // 字段依赖 当数据变更时就会重新校验相应的字段
  _dependencies = new Map<string, Map<string, NamePath>>()

  // 订阅对应的字段变更，并通知相应的 control
  subscribe(namePath?: NamePath, dependencies: NamePath[] = []) {
    const fieldName = BaseControl._getName(namePath)
    if (!fieldName || !namePath) return () => {} // 为空不进行操作

    const cancels = dependencies.map((dependency) => {
      // 被依赖项
      const depName = BaseControl._getName(dependency)
      if (!depName || fieldName === depName) return () => {}

      const cached = this._dependencies.get(depName) ?? new Map<string, NamePath>()
      this._dependencies.set(depName, cached.set(fieldName, namePath))
      return () => {
        const current = this._dependencies.get(depName)
        current?.delete(fieldName)
        current && !current.size && this._dependencies.delete(depName)
      }
    })
    return () => cancels.forEach((cancel) => cancel())
  }

  // 实现 useWatch 功能
  private _watchList: { namePath?: NamePath; callback: WatchCallBack<State> }[] = []

  registerWatch(namePath: NamePath | undefined, callback: (value: any, state: State) => void) {
    this._watchList.push({ namePath, callback })
    return () => {
      this._watchList = this._watchList.filter(({ callback: fn }) => fn !== callback)
    }
  }

  validate(value: any) {
    // 1. 遍历 _controls
    const list = [...this._controls.values()]
    return Promise.all(list).then(() => true)
  }
}

/** ===================================================== */
/** ===================================================== */
/** FormArray(特殊的FormField)                             */
/** ===================================================== */
/** ===================================================== */

export class FormArrayControl extends FormFieldControl {
  // 注册子控件
  registerField(control: FormFieldControl, namePath?: NamePath) {
    if (!this._parent || !(this._parent instanceof FormGroupControl)) {
      // logger.warn('无法正确注册')
      // 父级不存在或者父级不是FormGroupControl
      return () => {}
    }
    return this._parent.registerField(control, namePath)
  }

  /** ===================================================== */
  /** features                                              */
  /** ===================================================== */

  // add() {}

  // delete() {}

  // remove() {}
  // 可以直接操作 root._state
}

/**
 * 
 * private setFields = (fields: FieldData[]) => {
    this.warningUnhooked();

    const prevStore = this.store;

    const namePathList: InternalNamePath[] = [];

    fields.forEach((fieldData: FieldData) => {
      const { name, errors, ...data } = fieldData;
      const namePath = getNamePath(name);
      namePathList.push(namePath);

      // Value
      if ('value' in data) {
        this.updateStore(setValue(this.store, namePath, data.value));
      }

      this.notifyObservers(prevStore, [namePath], {
        type: 'setField',
        data: fieldData,
      });
    });

    this.notifyWatch(namePathList);
  };


    private notifyObservers = (
    prevStore: Store,
    namePathList: InternalNamePath[] | null,
    info: NotifyInfo,
  ) => {
    if (this.subscribable) {
      const mergedInfo: ValuedNotifyInfo = {
        ...info,
        store: this.getFieldsValue(true),
      };
      this.getFieldEntities().forEach(({ onStoreChange }) => {
        onStoreChange(prevStore, namePathList, mergedInfo);
      });
    } else {
      this.forceRootUpdate();
    }
  };

   Not use subscribe when using render props
   useSubscribe(!childrenRenderProps);
  
 */
